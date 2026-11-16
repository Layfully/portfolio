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

        // The Storyblok space also holds the link-in-bio site's stories, and every publish calls both sites' webhooks.
        // Only stories the build fetches (scripts/fetch-storyblok-data.mjs) need a new build here.
        var slug = StorySlug(await req.ReadAsStringAsync());
        if (slug is not null && !IsPortfolioStory(slug))
        {
            _logger.LogInformation("Story {Slug} isn't part of the portfolio build; nothing triggered.", slug);
            var skipped = req.CreateResponse(HttpStatusCode.OK);
            await skipped.WriteStringAsync($"Story {slug} isn't part of the portfolio build; nothing triggered.");
            return skipped;
        }

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

    // The languages the build fetches. With folder-level translation a story's slug starts with its language.
    private static readonly string[] LanguagePrefixes = ["en/", "pl/"];

    // The build fetches the stories that start with "portfolio" (starts_with in fetch-storyblok-data.mjs).
    internal static bool IsPortfolioStory(string slug)
    {
        foreach (var prefix in LanguagePrefixes)
        {
            if (slug.StartsWith(prefix, StringComparison.Ordinal))
            {
                slug = slug[prefix.Length..];
                break;
            }
        }

        return slug.StartsWith("portfolio", StringComparison.Ordinal);
    }

    // The story's full slug from Storyblok's webhook body ({ "action": "published", "full_slug": "portfolio", ... }).
    // Null when the body names no story: such a call still triggers a build, so a change in what Storyblok sends
    // can't quietly stop the builds.
    internal static string? StorySlug(string? body)
    {
        if (string.IsNullOrWhiteSpace(body))
        {
            return null;
        }

        try
        {
            using var document = JsonDocument.Parse(body);
            return document.RootElement.ValueKind == JsonValueKind.Object
                && document.RootElement.TryGetProperty("full_slug", out var slug)
                && slug.ValueKind == JsonValueKind.String
                && slug.GetString()?.Trim('/') is { Length: > 0 } name
                    ? name
                    : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private async Task<HttpResponseData> CreateErrorResponse(HttpRequestData req, HttpStatusCode statusCode, string message)
    {
        var response = req.CreateResponse(statusCode);
        await response.WriteStringAsync(message);
        return response;
    }
}
