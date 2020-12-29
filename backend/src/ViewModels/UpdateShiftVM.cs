using System;

namespace WhenIWork.ViewModels
{
  /**
   * REQUIREMENT: Per the spec, we're only allowed to change start and end
   * times. We're taking advantage of the ASP.NET Core deserializer to enforce
   * this rule. No matter what fields are in the JSON that gets sent to the end
   * point, only the start and end fields will be deserialized.
   */
  public class UpdateShiftVM
  {
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
  }
}
