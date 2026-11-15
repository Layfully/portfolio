using System.ComponentModel.DataAnnotations;

namespace api.Configuration;

public class GithubOptions
{
    [Required]
    public string User { get; set; } = string.Empty;

    /// <summary>
    /// The repository to notify, or several separated by commas (<c>portfolio,link-in-bio</c>): every site whose content
    /// comes from the Storyblok space that calls this webhook.
    /// </summary>
    [Required]
    public string Repository { get; set; } = string.Empty;

    [Required]
    public string EventType { get; set; } = string.Empty;

    [Required]
    public string Pat { get; set; } = string.Empty;

    [Required]
    public string WebhookTriggerSecret { get; set; } = string.Empty;

    /// <summary>The repositories named in <see cref="Repository"/>, each once.</summary>
    public IReadOnlyList<string> Repositories =>
        Repository.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
}
