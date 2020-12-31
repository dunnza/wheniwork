import { format, isMatch, isValid, parse } from "date-fns";
import { useState } from "react";
import Modal from "react-modal";
import axios from "../axios";
import { DATETIME_FORMATS } from "../utils";
import Button from "./Button";
import Input from "./Input";

function checkCanSubmit(shift) {
  // All fields are required so none should be empty strings
  const incomplete = Object.values(shift).some((v) => v === "");

  // We provide a couple of extra formats for browsers that do not support the
  // datetime-local input type so we check all of those to see if the user input
  // is a valid date. We must have valid dates to submit.
  let validDates = true;
  if (!DATETIME_FORMATS.some((f) => isMatch(shift.start, f))) {
    validDates = false;
  } else if (!DATETIME_FORMATS.some((f) => isMatch(shift.end, f))) {
    validDates = false;
  }

  return !incomplete && validDates;
}

function AddShiftModal({ isOpen, onRequestClose, onSubmit }) {
  const [shift, setShift] = useState({
    employee: "",
    start: "",
    end: "",
  });

  const [error, setError] = useState(null);

  // Check to see if we can submit given the shift configuration
  const canSubmit = checkCanSubmit(shift);

  function handleClose() {
    setShift({
      employee: "",
      start: "",
      end: "",
    });

    setError(null);
    onRequestClose();
  }

  function handleChange(which) {
    return (e) => {
      setShift({
        ...shift,
        [which]: e.target.value,
      });
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const now = new Date();
      await axios.post("/api/shifts", {
        employee: shift.employee,
        // Since we disable the "Add" button until we have valid dates, we can
        // assume that we will find a valid date here. If somehow we set start
        // or end to "undefined", the API will return an error since start and
        // end are required.
        start: DATETIME_FORMATS.map((f) => parse(shift.start, f, now)).find(
          isValid
        ),
        end: DATETIME_FORMATS.map((f) => parse(shift.end, f, now)).find(
          isValid
        ),
      });

      setShift({
        employee: "",
        start: "",
        end: "",
      });

      setError(null);
      onSubmit();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(error.message);
      }
    }
  }

  return (
    <Modal
      className="bg-white mt-10 mx-auto outline-none overflow-hidden rounded w-2/3"
      isOpen={isOpen}
      onRequestClose={handleClose}
      overlayClassName="fixed bg-blueGray-300 inset-0 bg-opacity-75"
    >
      <div className="bg-gradient-to-br from-blue-500 px-4 py-2 to-blue-800">
        <h2 className="text-2xl text-white">Add a Shift</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex mb-3 space-x-3">
            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="new-shift-employee"
              >
                Employee
              </label>

              <Input
                id="new-shift-employee"
                onChange={handleChange("employee")}
                value={shift.employee}
              />
            </div>

            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="new-shift-start"
              >
                Start
              </label>

              <Input
                id="new-shift-start"
                onChange={handleChange("start")}
                placeholder={format(new Date(), "M/d/yyyy h':00' a")}
                type="datetime-local"
                value={shift.start}
              />
            </div>

            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="new-shift-end"
              >
                End
              </label>

              <Input
                id="new-shift-end"
                onChange={handleChange("end")}
                placeholder={format(new Date(), "M/d/yyyy h':00' a")}
                type="datetime-local"
                value={shift.end}
              />
            </div>
          </div>

          {error ? (
            <div className="bg-red-200 border border-red-700 mb-3 p-2 rounded text-red-700">
              <h3 className="font-semibold text-lg">An Error Occurred</h3>
              <p>{error}</p>
            </div>
          ) : null}

          <Button color="primary" disabled={!canSubmit} type="submit">
            Add
          </Button>

          <Button className="ml-1" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export default AddShiftModal;
