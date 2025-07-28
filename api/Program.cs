using api.Configuration;
using api.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.AddOptions<EmailOptions>().BindConfiguration("EmailOptions");
builder.Services.AddOptions<GithubOptions>().BindConfiguration("GithubOptions");

builder.Services.AddEmailServices();
builder.Services.AddHttpClient();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
