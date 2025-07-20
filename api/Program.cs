using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;
using api.Extensions;
using api.Configuration;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.Configure<EmailOptions>(options =>
{
  options.SendGridApiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY") ?? string.Empty;
  options.ToEmailAddress = Environment.GetEnvironmentVariable("TO_EMAIL_ADDRESS") ?? string.Empty;
  options.FromEmailAddress = Environment.GetEnvironmentVariable("FROM_EMAIL_ADDRESS") ?? string.Empty;
  options.FromDisplayName = "Your Portfolio Site";
});

builder.Services.AddEmailServices();

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
