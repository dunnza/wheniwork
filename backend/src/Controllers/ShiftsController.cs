using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WhenIWork.Domain;
using WhenIWork.ViewModels;

namespace WhenIWork.Controllers
{
  /**
   * This class implements the REST endpoint for this application. I've tried to
   * keep the actions as simple as possible and moved logic into services that
   * can be more easily tested in isolation.
   */
  [ApiController, Route("api/[controller]")]
  public class ShiftsController : ControllerBase
  {
    private readonly IShiftService _shiftService;

    // Access the service via dependency injection that we setup in the
    // Startup.cs file.
    public ShiftsController(IShiftService shiftService) {
      _shiftService = shiftService;
    }

    // REQUIREMENT: List shifts. This endpoint returns all shifts in the data
    // store. It can be filtered by start and end times, and returns the data
    // ordered by start time. See the ShiftQuery class for implementation
    // details.
    [HttpGet]
    public async Task<ActionResult<List<Shift>>> GetShifts([FromQuery] ShiftQuery query) {
      try {
        var shifts = await _shiftService.GetShiftsAsync();

        return Ok(
          query.Apply(shifts)
        );
      } catch (Exception ex) {
        return BadRequest(ex.Message);
      }
    }

    // REQUIREMENT: View a shift. This action returns a single shift given its
    // ID. If we cannot find the shift in our data store, we return a 404 status
    // code.
    [HttpGet("{id}")]
    public async Task<ActionResult<Shift>> GetShiftByID(Guid id) {
      try {
        var shift = await _shiftService.GetShiftAsync(id);
        if (shift == null) {
          return NotFound($"Shift with ID '{id}' could not be found.");
        }

        return Ok(shift);
      } catch (Exception ex) {
        return BadRequest(ex.Message);
      }
    }

    // REQUIREMENT: Create a shift. This action takes a partially constructed
    // shift with all necessary information and adds a new shift to the data
    // store, returning the shift with all of the information (such as ID).
    [HttpPost]
    public async Task<ActionResult<Shift>> CreateShift(Shift newShift) {
      try {
        var shift = await _shiftService.AddShiftAsync(newShift);
        return Ok(shift);
      } catch (Exception ex) {
        return BadRequest(ex.Message);
      }
    }

    // REQUIREMENT: Edit a shift. This action takes a view model with the
    // data that we want to change, then returns the updated shift. If the shift
    // does not exist, we return a 404 status code.
    //
    // NOTE: We use PATCH since, per the spec, PUT requests are supposed to
    // provide the entire model. We're content to just provide what needs to be
    // updated on the shift.
    [HttpPatch("{id}")]
    public async Task<ActionResult<Shift>> UpdateShift(Guid id, UpdateShiftVM update) {
      try {
        var shift = await _shiftService.UpdateShiftAsync(id, update);
        if (shift == null) {
          return NotFound($"Shift with ID '{id}' could not be found.");
        }

        return Ok(shift);
      } catch (Exception ex) {
        return BadRequest(ex.Message);
      }
    }

    // REQUIREMENT: Delete a shift. This action does just that: deletes the
    // shift with the given ID.
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteShift(Guid id) {
      try {
        await _shiftService.DeleteShiftAsync(id);
        return Ok();
      } catch (Exception ex) {
        return BadRequest(ex.Message);
      }
    }
  }
}
