import { format, parseJSON } from "date-fns";
import ShiftList from "./ShiftList";

function grouper(acc, curr) {
  const currStartDate = parseJSON(curr.start);
  const group = acc.find((g) => g.date === format(currStartDate, "M/d/yyyy"));

  if (!group) {
    acc.push({
      date: format(currStartDate, "M/d/yyyy"),
      shifts: [curr],
    });
  } else {
    group.shifts.push(curr);
  }

  return acc;
}

function GroupedShifts({ onEditShift, shifts }) {
  const groups = shifts.reduce(grouper, []);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.date}>
          <h2 className="font-bold mb-2 px-3 text-2xl">{g.date}</h2>
          <ShiftList onEditShift={onEditShift} shifts={g.shifts} />
        </div>
      ))}
    </div>
  );
}

export default GroupedShifts;
