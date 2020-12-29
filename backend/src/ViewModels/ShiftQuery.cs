using System;
using System.Collections.Generic;
using System.Linq;
using WhenIWork.Domain;

namespace WhenIWork.ViewModels
{
  /**
   * This an abstraction of the query string to be used when fetching all of the
   * shifts. It is nice because it is easy to add filters to and the logic for
   * filtering is in a testable location. It uses ASP.NET Core's model binder to
   * create the class from the query string of a request.
   *
   * REQUIREMENT: This class is responsible for filtering shifts by start and
   * end time, and ordering it by start time.
   */
  public class ShiftQuery
  {
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }

    public List<Shift> Apply(IEnumerable<Shift> shifts) {
      var filtered = shifts;

      // To return more inclusive results, I include shifts that are partially
      // in the window given the start and end times that we want to filter on.
      // So for example, if you selected 12/26/2020 10:00 AM as your start time,
      // the API could give you back a shift that started on 12/26/2020 8:00 AM
      // as long as it ended after 10:00 AM.
      if (Start != null) {
        filtered = filtered.Where(s => s.End >= Start.Value.ToUniversalTime());
      }

      // We do the same here as we did with the start time above, but the
      // opposite since we're given the end time.
      if (End != null) {
        filtered = filtered.Where(s => s.Start <= End.Value.ToUniversalTime());
      }

      // So they are first sorted by start time per the spec, but I took the
      // liberty of THEN sorting by the end time in case there were two shifts
      // that had the same start time but different end times. I figured you'd
      // want the one that ends sooner to be listed first.
      filtered = filtered.OrderBy(s => s.Start)
        .ThenBy(s => s.End);

      return filtered.ToList();
    }
  }
}
