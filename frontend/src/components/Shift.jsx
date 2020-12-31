import { format, parseJSON } from "date-fns";
import { useRouter } from "next/router";
import axios from "../axios";
import Button from "../components/Button";

function Shift({ onEdit, shift }) {
  const router = useRouter();

  const parsedStartTime = parseJSON(shift.start);
  const parsedEndTime = parseJSON(shift.end);

  // We know that we group by the shift start time, so if the end date is
  // different from the start date, we know it goes over night and we should
  // include the date in our display.
  const isEndDateDifferent =
    format(parsedStartTime, "M/d/yyyy") !== format(parsedEndTime, "M/d/yyyy");

  async function handleDelete() {
    await axios.delete(`/api/shifts/${shift.id}`);

    // This is a nifty trick for "re-server-rendering" the page since the data
    // changed, this allows us to avoid doing a page reload.
    // More reading: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    router.replace(router.asPath);
  }

  return (
    <li className="border p-3 rounded">
      <h3 className="flex font-medium items-center mb-1 text-xl">
        {shift.employee}

        <Button
          className="ml-auto uppercase"
          color="primary"
          onClick={() => onEdit(shift)}
          size="small"
        >
          edit
        </Button>

        <Button
          className="ml-1 uppercase"
          color="danger"
          onClick={handleDelete}
          size="small"
        >
          delete
        </Button>
      </h3>
      {format(parsedStartTime, "h:mm a")} to{" "}
      {isEndDateDifferent
        ? format(parsedEndTime, "h:mm a (M/d/yyyy)")
        : format(parsedEndTime, "h:mm a")}
    </li>
  );
}

export default Shift;
