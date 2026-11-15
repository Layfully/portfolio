using System.Net;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;
using api.Configuration;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace api;

/// <summary>
/// Storyblok's webhook calls this on a publish; it starts the deploy of every site built from that content by sending
/// GitHub a <c>repository_dispatch</c> event. Storyblok can't send GitHub's Authorization header itself, so the token
/// stays here, and a secret in the webhook's address keeps strangers from starting builds.
/// </summary>
public class TriggerGitHubAction
{
    private readonly ILogger<TriggerGitHubAction> _logger;
    private readonly HttpClient _httpClient;
    private readonly GithubOptions _githubOptions;

    public TriggerGitHubAction(ILogger<TriggerGitHubAction> logger, IHttpClientFactory httpClientFactory, IOptions<GithubOptions> githubOptions)
    {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _githubOptions = githubOptions.Value;
    }

    [Function("trigger_github_action")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "TriggerBuild")] HttpRequestData req)
    {
        _logger.LogInformation("Webhook received, attempting to validate secret from URL...");

        var providedSecret = HttpUtility.ParseQueryString(req.Url.Query)["secret"];

        if (!IsExpectedSecret(providedSecret))
        {
            _logger.LogWarning("Invalid or missing secret key in URL. Request rejected.");
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        }

        var repositories = _githubOptions.Repositories;

        if (string.IsNullOrEmpty(_githubOptions.Pat) ||
            string.IsNullOrEmpty(_githubOptions.User) ||
            string.IsNullOrEmpty(_githubOptions.EventType) ||
            repositories.Count == 0)
        {
            _logger.LogError("Server configuration error: GitHubOptions is missing required values (Pat, User, Repository, EventType).");
            return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "Error in server configuration.");
        }

        // Every repository is asked, even after one fails: a site whose dispatch went through still deploys.
        var failed = new List<string>();
        foreach (var repository in repositories)
        {
            if (!await TryDispatchAsync(repository))
            {
                failed.Add(repository);
            }
        }

        if (failed.Count > 0)
        {
            return await CreateErrorResponse(req, HttpStatusCode.BadGateway, $"Failed to trigger the build of {string.Join(", ", failed)}.");
        }

        var successResponse = req.CreateResponse(HttpStatusCode.OK);
        await successResponse.WriteStringAsync($"Build successfully triggered for {string.Join(", ", repositories)}.");
        return successResponse;
    }

    // Compared in constant time, so the response time doesn't tell how much of a guess was right.
    private bool IsExpectedSecret(string? providedSecret)
    {
        var expectedSecret = _githubOptions.WebhookTriggerSecret;
        if (string.IsNullOrEmpty(expectedSecret) || providedSecret is null)
        {
            return false;
        }

        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expectedSecret), Encoding.UTF8.GetBytes(providedSecret));
    }

    private async Task<bool> TryDispatchAsync(string repository)
    {
        try
        {
            // Headers on each request rather than on the client, so nothing piles up between calls.
            using var request = new HttpRequestMessage(HttpMethod.Post, $"https://api.github.com/repos/{_githubOptions.User}/{repository}/dispatches")
            {
                Content = new StringContent(JsonSerializer.Serialize(new { event_type = _githubOptions.EventType }), Encoding.UTF8, "application/json"),
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _githubOptions.Pat);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
            request.Headers.UserAgent.Add(new ProductInfoHeaderValue("Portfolio-Azure-Function", "1.0"));
            request.Headers.Add("X-GitHub-Api-Version", "2022-11-28");

            using var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Successfully triggered GitHub Action build of {Repository} for event type '{EventType}'.", repository, _githubOptions.EventType);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to trigger GitHub Action of {Repository}. Status: {StatusCode}, Reason: {Reason}", repository, response.StatusCode, errorContent);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred while triggering the build of {Repository}.", repository);
            return false;
        }
    }

    private static async Task<HttpResponseData> CreateErrorResponse(HttpRequestData req, HttpStatusCode statusCode, string message)
    {
        var response = req.CreateResponse(statusCode);
        await response.WriteStringAsync(message);
        return response;
    }
}
