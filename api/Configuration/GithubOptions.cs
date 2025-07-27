using System.ComponentModel.DataAnnotations;

namespace api.Configuration;
public class GithubOptions
{
  [Required]
  public string User { get; set; } = string.Empty;

  [Required]
  public string Repository { get; set; } = string.Empty;

  [Required]
  public string EventType { get; set; } = string.Empty;

  [Required]
  public string Pat { get; set; } = string.Empty;
}
