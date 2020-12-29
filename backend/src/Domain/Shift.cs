using System;
using System.ComponentModel.DataAnnotations;

namespace WhenIWork.Domain
{
  /**
   * The main domain model of this application. It represents a work shift for a
   * single employee.
   */
  public class Shift
  {
    /**
     * Since I'm using a file and not a database solution that can handle auto-
     * incrementing IDs for me, I opted to use a GUID instead of an nubmer.
     * They're easy to generate though they're not terribly developer-friendly
     * while debugging!
     */
    public Guid ID { get; set; }

    /**
     * To keep things simple I just use a string for the employee. An obvious
     * improvement would be to make this an actual User entity.
     *
     * I'm using ASP.NET Core data annotation attributes to enforce certain
     * rules for the ASP.NET Core model binder. Especially when creating a new
     * shift we need to have certain information, and these attributes allow us
     * to have ASP.NET Core do the heavy lifting instead of doing those checks
     * ourselves.
     */
    [Required]
    public string Employee { get; set; }

    // We use the [Required] attribute again to make sure that we can't add a
    // shift without a start time. Due to the way DateTimes work in C#, we have
    // to make the field a nullable DateTime. That way, if the API user leaves
    // off that field in the body, Start will be null and the [Required]
    // attribute will send back an error message. Because of this we have to
    // make a few extra checks when it comes to these fields in our service.
    [Required]
    public DateTime? Start { get; set; }

    // We use the [Required] attribute again to make sure that we can't add a
    // shift without an end time. Due to the way DateTimes work in C#, we have
    // to make the field a nullable DateTime. That way, if the API user leaves
    // off that field in the body, End will be null and the [Required]
    // attribute will send back an error message. Because of this we have to
    // make a few extra checks when it comes to these fields in our service.
    [Required]
    public DateTime? End { get; set; }
  }
}
