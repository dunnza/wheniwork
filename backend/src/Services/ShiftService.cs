using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WhenIWork.Domain;
using WhenIWork.ViewModels;

namespace WhenIWork.Services
{
  public class ShiftService : IShiftService
  {
    private async Task SaveShiftsAsync(List<Shift> shifts) {
      // I use a create mode file stream so that the whole file gets written
      // every time. I was having issues where it was only writing the bytes it
      // needed to at the front and leaving malformed JSON. If I have time I'll
      // look into either doing partial updates or moving to a database.
      //
      // This method will get slower as the dataset grows.
      using FileStream writeStream = File.Create(
        Path.Combine(Directory.GetCurrentDirectory(), "shifts.json")
      );

      await JsonSerializer.SerializeAsync(
        writeStream,
        shifts,
        new JsonSerializerOptions {
          WriteIndented = true
        }
      );
    }

    /**
     * A production application would add more checks like "the end time must be
     * later than the start time".
     */
    public async Task<Shift> AddShiftAsync(Shift newShift) {
      // Convert times to universal at the top so that we don't have to do it
      // repeatedly throughout the method.
      newShift.Start = newShift.Start?.ToUniversalTime();
      newShift.End = newShift.End?.ToUniversalTime();

      var shifts = await GetShiftsAsync();
      var shift = new Shift {
        ID = Guid.NewGuid(),
        Employee = newShift.Employee,
        Start = newShift.Start,
        End = newShift.End
      };

      // REQUIREMENT: Per the "create a shift" spec, we cannot add a shift if
      // it then overlaps with an existing shift for the same user.
      //
      // NOTE: I chose to count shifts that start at the same time as the
      // another one ends as overlapping. This could easily be changed by
      // changing the term `newShift.Start <= s.End` to just `newShift.Start < s.End`
      // and `newShift.End >= s.Start` to `newShift.End > s.Start`.
      var employeeShifts = shifts.Where(s => s.Employee == newShift.Employee);
      bool isOverlap = employeeShifts.Any(s => {
        return (newShift.Start >= s.Start && newShift.Start <= s.End) ||
          (newShift.End >= s.Start && newShift.End <= s.End);
      });

      if (isOverlap) {
        throw new Exception($"This shift overlaps with another on {newShift.Employee}'s schedule.");
      } else {
        shifts.Add(shift);
        await SaveShiftsAsync(shifts);
        return shift;
      }
    }

    public async Task DeleteShiftAsync(Guid id) {
      var shifts = await GetShiftsAsync();
      var shift = shifts.SingleOrDefault(s => s.ID == id);
      if (shift != null) {
        shifts.Remove(shift);
        await SaveShiftsAsync(shifts);
      }
    }

    /**
     * REQUIREMENT: This method gets a single shift per the "view a shift" spec.
     */
    public async Task<Shift> GetShiftAsync(Guid id) {
      var shifts = await GetShiftsAsync();
      return shifts.SingleOrDefault(s => s.ID == id);
    }

    /**
     * REQUIREMENT: This is the method used to list shifts. It's also used in
     * nearly all the other methods to fetch the data. The method is pretty
     * straightforward. It uses the built-in JSON library to deserialize the
     * JSON into plain .NET objects.
     */
    public async Task<List<Shift>> GetShiftsAsync() {
      using FileStream openStream = File.OpenRead(
        Path.Combine(Directory.GetCurrentDirectory(), "shifts.json")
      );

      return await JsonSerializer.DeserializeAsync<List<Shift>>(openStream);
    }

    public async Task<Shift> UpdateShiftAsync(Guid id, UpdateShiftVM update) {
      var shifts = await GetShiftsAsync();
      var shift = shifts.SingleOrDefault(s => s.ID == id);
      if (shift != null) {
        // All the DateTimes in the data store are in UTC, so we want to convert
        // these to UTC to make sure we're comparing apples to apples. Also we
        // will assign these to an existing shift later on so if we convert them
        // now we won't have to do it then.
        //
        // We use the C# null-conditional member access operators since either
        // DateTime could be null and we don't want to get a runtime error
        // trying to access members on null.
        update.Start = update.Start?.ToUniversalTime();
        update.End = update.End?.ToUniversalTime();

        // REQUIREMENT: Per the "edit a shift" spec, we cannot change a shift if
        // it then overlaps with an existing shift for the same user. In the
        // update method we must exclude the shift we're trying to update from
        // the shifts to compare against. It wouldn't cause a problem if we were
        // expanding the shift but when you are shrinking the shift it will
        // think there's an overlap ... against the shift you're updating.
        //
        // NOTE: I chose to count shifts that start at the same time as the
        // another one ends as overlapping. This could easily be changed by
        // changing the term `update.Start <= s.End` to just `update.Start < s.End`
        // and `update.End >= s.Start` to `update.End > s.Start`.
        var employeeShifts = shifts.Where(s => s.ID != shift.ID)
          .Where(s => s.Employee == shift.Employee);

        bool isOverlap = employeeShifts.Any(s => {
          if (update.Start != null) {
            return update.Start >= s.Start && update.Start <= s.End;
          }

          if (update.End != null) {
            return update.End >= s.Start && update.End <= s.End;
          }

          // If neither the new start or end dates overlap then we can say that
          // the new times don't overlap with this shift so we return false.
          return false;
        });

        if (isOverlap) {
          throw new Exception($"These changes overlap with another shift on {shift.Employee}'s schedule.");
        } else {
          // So, being here we know there are no overlaps between shifts so we
          // can safely assign the start and end times. We use the C#
          // null-coalescing operator to only assign the `update` object's value
          // if it is non-null.
          shift.Start = update.Start ?? shift.Start;
          shift.End = update.End ?? shift.End;
          await SaveShiftsAsync(shifts);
          return shift;
        }
      }

      return null;
    }
  }
}
