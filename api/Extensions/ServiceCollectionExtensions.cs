using api.Configuration;
using api.Services;
using api.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SendGrid;

namespace api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddEmailServices(this IServiceCollection services)
    {
        services.AddScoped<ISendGridClient>(provider =>
        {
            var emailOptions = provider.GetRequiredService<IOptions<EmailOptions>>().Value;

            if (string.IsNullOrEmpty(emailOptions.SendGridApiKey))
            {
                throw new InvalidOperationException("SENDGRID_API_KEY environment variable is not set");
            }

            return new SendGridClient(emailOptions.SendGridApiKey);
        });

        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}
