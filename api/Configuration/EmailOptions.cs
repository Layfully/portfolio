using System.ComponentModel.DataAnnotations;

namespace api.Configuration;

public class EmailOptions
{
    [Required]
    [EmailAddress]
    public string FromEmailAddress { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string ToEmailAddress { get; set; } = string.Empty;

    [Required]
    public string SendGridApiKey { get; set; } = string.Empty;

    public string FromDisplayName { get; set; } = "Your Portfolio Site";
}
