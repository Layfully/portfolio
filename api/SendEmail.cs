using System.Net;
using System.Text.Json;
using api.Configuration;
using api.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace api;

public record ContactFormRequest(string? Email, string? Message);

public class SendEmail
{
    private readonly ILogger<SendEmail> _logger;
    private readonly IEmailService _emailService;
    private readonly EmailOptions _emailOptions;

    public SendEmail(ILogger<SendEmail> logger, IEmailService emailService, IOptions<EmailOptions> emailOptions)
    {
        _logger = logger;
        _emailService = emailService;
        _emailOptions = emailOptions.Value;
    }

    [Function("send_email")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
    {
        _logger.LogInformation("Processing contact form submission.");

        if (string.IsNullOrEmpty(_emailOptions.ToEmailAddress) ||
                string.IsNullOrEmpty(_emailOptions.FromEmailAddress) ||
            string.IsNullOrEmpty(_emailOptions.SendGridApiKey))
        {
            _logger.LogError("Server configuration error: Required email configuration is missing.");
            return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "Error in server configuration.");
        }

        try
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<ContactFormRequest>(requestBody, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (data is null || string.IsNullOrWhiteSpace(data.Email) || string.IsNullOrWhiteSpace(data.Message))
            {
                _logger.LogWarning("Invalid request: Email or message is missing.");
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Please provide both an email and a message.");
            }

            if (!IsValidEmail(data.Email))
            {
                _logger.LogWarning("Invalid email format provided: {Email}", data.Email);
                return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Please provide a valid email address.");
            }

            var success = await _emailService.SendContactFormEmailAsync(data.Email, data.Message);

            if (success)
            {
                var successResponse = req.CreateResponse(HttpStatusCode.OK);
                return successResponse;
            }
            else
            {
                return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "Failed to send the message.");
            }
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Invalid JSON in request body.");
            return await CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request format.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred during execution.");
            return await CreateErrorResponse(req, HttpStatusCode.InternalServerError, "An internal error occurred.");
        }
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
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
