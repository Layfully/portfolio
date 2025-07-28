namespace api.Services.Interfaces;

public interface IEmailService
{
    Task<bool> SendContactFormEmailAsync(string userEmail, string message);
}
