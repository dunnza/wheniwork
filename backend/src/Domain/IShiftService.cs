using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WhenIWork.ViewModels;

namespace WhenIWork.Domain
{
  /**
   * We use this interface for dependency injection. It's helpful for testing as
   * you can mock the implementation easily.
   */
  public interface IShiftService
  {
    Task<Shift> AddShiftAsync(Shift newShift);
    Task DeleteShiftAsync(Guid id);
    Task<List<Shift>> GetShiftsAsync();
    Task<Shift> GetShiftAsync(Guid id);
    Task<Shift> UpdateShiftAsync(Guid id, UpdateShiftVM update);
  }
}
