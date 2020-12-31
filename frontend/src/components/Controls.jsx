import Button from "./Button";
import Filters from "./Filters";

function Controls({ onClickAddShift }) {
  return (
    <div className="space-y-3 sticky top-3">
      <Filters />

      <Button
        className="w-full"
        color="primary"
        onClick={onClickAddShift}
        type="button"
      >
        Add a Shift
      </Button>
    </div>
  );
}

export default Controls;
