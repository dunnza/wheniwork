import { useRouter } from "next/router";
import { useState } from "react";
import axios from "../axios";
import AddShiftModal from "../components/AddShiftModal";
import Controls from "../components/Controls";
import EditShiftModal from "../components/EditShiftModal";
import GroupedShifts from "../components/GroupedShifts";
import Layout from "../components/Layout";

function HomePage({ shifts }) {
  const [state, setState] = useState({
    addModalOpen: false,
    editModalOpen: false,
    shift: null,
  });

  const router = useRouter();

  async function handleAddShift() {
    // This is a nifty trick for "re-server-rendering" the page since the data
    // changed, this allows us to avoid doing a page reload.
    // More reading: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    await router.replace(router.asPath);
    setState({
      ...state,
      addModalOpen: false,
    });
  }

  function handleEditShift(shift) {
    setState({
      ...state,
      editModalOpen: true,
      shift,
    });
  }

  async function handleSaveShift() {
    // This is a nifty trick for "re-server-rendering" the page since the data
    // changed, this allows us to avoid doing a page reload.
    // More reading: https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
    await router.replace(router.asPath);
    setState({
      ...state,
      editModalOpen: false,
      shift: null,
    });
  }

  return (
    <Layout>
      <div className="flex mx-auto space-x-3 w-2/3">
        <div className="w-3/5">
          {shifts.length === 0 ? (
            <p className="text-center text-lg">
              There no shifts to display, try adding some or adjusting your
              filters!
            </p>
          ) : (
            <GroupedShifts onEditShift={handleEditShift} shifts={shifts} />
          )}
        </div>

        <div className="flex-1">
          <Controls
            onClickAddShift={() => setState({ ...state, addModalOpen: true })}
          />
        </div>
      </div>

      <AddShiftModal
        isOpen={state.addModalOpen}
        onRequestClose={() => setState({ ...state, addModalOpen: false })}
        onSubmit={handleAddShift}
      />

      {state.shift ? (
        <EditShiftModal
          isOpen={state.editModalOpen}
          onRequestClose={() => setState({ ...state, editModalOpen: false })}
          onSave={handleSaveShift}
          shift={state.shift}
        />
      ) : null}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await axios.get("/api/shifts", { params: context.query });

  return {
    props: {
      shifts: res.data,
    },
  };
}

export default HomePage;
