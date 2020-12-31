import { format, isEqual, isValid, parse, parseJSON } from "date-fns";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "../axios";
import { DATETIME_FORMATS } from "../utils";
import Button from "./Button";
import Input from "./Input";

function areDifferentAndValid(shift, updated) {
  const parsed = DATETIME_FORMATS.map((f) =>
    parse(updated, f, new Date())
  ).find(isValid);

  return parsed && !isEqual(parseJSON(shift), parsed);
}

function checkCanSubmit(shift, updated) {
  return (
    areDifferentAndValid(shift.start, updated.start) ||
    areDifferentAndValid(shift.end, updated.end)
  );
}

function EditShiftModal({ isOpen, onRequestClose, onSave, shift }) {
  const [updated, setUpdated] = useState({ start: "", end: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    setUpdated({
      start: format(parseJSON(shift.start), "yyyy-MM-dd'T'HH:mm"),
      end: format(parseJSON(shift.end), "yyyy-MM-dd'T'HH:mm"),
    });
  }, [shift]);

  // Check to see if we can submit given the shift configuration
  const canSubmit = checkCanSubmit(shift, updated);

  function handleClose() {
    setUpdated({
      start: format(parseJSON(shift.start), "yyyy-MM-dd'T'HH:mm"),
      end: format(parseJSON(shift.end), "yyyy-MM-dd'T'HH:mm"),
    });

    setError(null);
    onRequestClose();
  }

  function handleChange(which) {
    return (e) => {
      setUpdated({
        ...updated,
        [which]: e.target.value,
      });
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const now = new Date();
      let patch = {};
      if (areDifferentAndValid(shift.start, updated.start)) {
        patch.start = DATETIME_FORMATS.map((f) =>
          parse(updated.start, f, now)
        ).find(isValid);
      }

      if (areDifferentAndValid(shift.end, updated.end)) {
        patch.end = DATETIME_FORMATS.map((f) =>
          parse(updated.end, f, now)
        ).find(isValid);
      }

      await axios.patch(`/api/shifts/${shift.id}`, patch);
      setError(null);
      onSave();
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
        <h2 className="text-2xl text-white">Edit Shift</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex mb-3 space-x-3">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Employee</label>
              <Input readOnly value={shift.employee} />
            </div>

            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="edit-shift-start"
              >
                Start
              </label>

              <Input
                id="edit-shift-start"
                onChange={handleChange("start")}
                placeholder={format(new Date(), "M/d/yyyy h':00' a")}
                type="datetime-local"
                value={updated.start}
              />
            </div>

            <div className="flex-1">
              <label
                className="block font-semibold mb-1"
                htmlFor="edit-shift-end"
              >
                End
              </label>

              <Input
                id="edit-shift-end"
                onChange={handleChange("end")}
                placeholder={format(new Date(), "M/d/yyyy h':00' a")}
                type="datetime-local"
                value={updated.end}
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
            Save
          </Button>

          <Button className="ml-1" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export default EditShiftModal;
