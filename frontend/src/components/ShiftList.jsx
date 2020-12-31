import Shift from "./Shift";

function ShiftList({ onEditShift, shifts }) {
  return (
    <ul className="space-y-2">
      {shifts.map((s) => (
        <Shift key={s.id} onEdit={onEditShift} shift={s} />
      ))}
    </ul>
  );
}

export default ShiftList;
