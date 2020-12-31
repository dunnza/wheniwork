import { format, isMatch, isValid, parse } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { DATETIME_FORMATS } from "../utils";
import Button from "./Button";
import Input from "./Input";

function checkCanApplyFilters(filters) {
  const values = Object.values(filters);
  const allEmpty = values.every((v) => v === "");
  const allValid = values.every(
    (v) => v === "" || DATETIME_FORMATS.some((f) => isMatch(v, f))
  );

  return !allEmpty && allValid;
}

function Filters() {
  const [filters, setFilters] = useState({
    start: "",
    end: "",
  });

  const router = useRouter();

  // This expression tells us that we do not have any filters applied, so we can
  // disable the "Reset" button.
  const isBase = Object.keys(router.query).length === 0;

  // We only want to enable the "Apply" button if we have only valid filters to
  // apply.
  const canApplyFilters = checkCanApplyFilters(filters);

  function handleChange(which) {
    return (e) => {
      setFilters({
        ...filters,
        [which]: e.target.value,
      });
    };
  }

  async function handleApply(e) {
    e.preventDefault();

    const now = new Date();
    const params = new URLSearchParams();
    for (let [key, value] of Object.entries(filters)) {
      // We try parsing the value against every datetime format, then find the
      // first valid date. If `parsed` is undefined, that means the value was
      // not a valid date according to our formats so we don't add it to our
      // querystring
      const parsed = DATETIME_FORMATS.map((f) => parse(value, f, now)).find(
        isValid
      );

      if (value !== "" && parsed) {
        params.append(key, parsed.toISOString());
      }
    }

    if (params.toString() !== "") {
      await router.push(`?${params.toString()}`);

      setFilters({
        start: "",
        end: "",
      });
    }
  }

  function handleReset() {
    setFilters({
      start: "",
      end: "",
    });

    router.push("/");
  }

  return (
    <div className="border overflow-hidden rounded">
      <div className="bg-gradient-to-br from-blue-500 px-3 py-1.5 to-blue-800">
        <h3 className="text-lg text-white">Filters</h3>
      </div>

      <div className="p-3">
        <form onSubmit={handleApply}>
          <div className="mb-3">
            <label className="block font-semibold mb-1" htmlFor="start-time">
              Start Time
            </label>

            <Input
              id="start-time"
              onChange={handleChange("start")}
              placeholder={format(new Date(), "M/d/yyyy h':00' a")}
              type="datetime-local"
              value={filters.start}
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-1" htmlFor="end-time">
              End Time
            </label>

            <Input
              id="end-time"
              onChange={handleChange("end")}
              placeholder={format(new Date(), "M/d/yyyy h':00' a")}
              type="datetime-local"
              value={filters.end}
            />
          </div>

          <Button color="primary" disabled={!canApplyFilters} type="submit">
            Apply
          </Button>

          <Button
            className="ml-1"
            color="secondary"
            disabled={isBase}
            onClick={handleReset}
            type="button"
          >
            Reset
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Filters;
