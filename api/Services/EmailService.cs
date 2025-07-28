using api.Configuration;
using api.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace api.Services;

public class EmailService : IEmailService
{
    private readonly ISendGridClient _sendGridClient;
    private readonly ILogger<EmailService> _logger;
    private readonly EmailOptions _emailOptions;

    public EmailService(ISendGridClient sendGridClient, ILogger<EmailService> logger, IOptions<EmailOptions> emailOptions)
    {
        _sendGridClient = sendGridClient;
        _logger = logger;
        _emailOptions = emailOptions.Value;
    }

    public async Task<bool> SendContactFormEmailAsync(string userEmail, string message)
    {
        try
        {
            var from = new EmailAddress(_emailOptions.FromEmailAddress, _emailOptions.FromDisplayName);
            var to = new EmailAddress(_emailOptions.ToEmailAddress);
            var subject = $"New Contact Form Submission from {userEmail}";
            var htmlContent = BuildEmailContent(userEmail, message);

            var replyTo = new EmailAddress(userEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, string.Empty, htmlContent);
            msg.SetReplyTo(replyTo);

            var response = await _sendGridClient.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email sent successfully from {Email}", userEmail);
                return true;
            }
            else
            {
                _logger.LogError("Failed to send email. SendGrid responded with status: {StatusCode}", response.StatusCode);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while sending email from {Email}", userEmail);
            return false;
        }
    }

    private static string BuildEmailContent(string email, string message)
    {
        var sanitizedMessage = System.Net.WebUtility.HtmlEncode(message).Replace("\n", "<br>");
        var sanitizedEmail = System.Net.WebUtility.HtmlEncode(email);

        return $@"
            <p>You have a new contact form submission:</p>
            <p><strong>From:</strong> {sanitizedEmail}</p>
            <p><strong>Message:</strong></p>
            <blockquote style='border-left: 2px solid #ccc; padding-left: 1em; margin-left: 0;'>
                {sanitizedMessage}
            </blockquote>";
    }
}
