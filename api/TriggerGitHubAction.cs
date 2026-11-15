using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Web;
using api.Configuration;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace api;

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

        var expectedSecret = _githubOptions.WebhookTriggerSecret;

        var query = HttpUtility.ParseQueryString(req.Url.Query);
        var providedSecret = query["secret"];

        if (string.IsNullOrEmpty(expectedSecret) || !expectedSecret.Equals(providedSecret))
        {
            _logger.LogWarning("Invalid or missing secret key in URL. Request rejected.");
            return req.CreateResponse(HttpStatusCode.Unauthorized);
        }

        _logger.LogInformation("Secret key is valid.");

        _logger.LogInformation("Processing request to trigger GitHub Action build.");

        if (string.IsNullOrEmpty(_githubOptions.Pat) ||
            string.IsNullOrEmpty(_githubOptions.User) ||
            string.IsNullOrEmpty(_githubOptions.Repository))
        {
            _logger.LogError("Server configuration error: GitHubOptions is missing required values (Pat, User, Repository).");
            return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "Error in server configuration.");
        }

        try
        {
            var githubApiUrl = $"https://api.github.com/repos/{_githubOptions.User}/{_githubOptions.Repository}/dispatches";

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _githubOptions.Pat);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
            _httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("Portfolio-Azure-Function", "1.0"));

            var requestBody = new { event_type = _githubOptions.EventType };
            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(githubApiUrl, jsonContent);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Successfully triggered GitHub Action build for event type '{EventType}'.", _githubOptions.EventType);
                var successResponse = req.CreateResponse(HttpStatusCode.OK);
                await successResponse.WriteStringAsync("Build successfully triggered.");
                return successResponse;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to trigger GitHub Action. Status: {StatusCode}, Reason: {Reason}", response.StatusCode, errorContent);
            return await CreateErrorResponse(req, HttpStatusCode.BadGateway, "Failed to communicate with GitHub.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred during execution.");
            return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "An internal error occurred.");
        }
    }

    private async Task<HttpResponseData> CreateErrorResponse(HttpRequestData req, HttpStatusCode statusCode, string message)
    {
        var response = req.CreateResponse(statusCode);
        await response.WriteStringAsync(message);
        return response;
    }
}
