import React from "react";
import History from "../components/delivererPageComponents/History";
import Deliveries from "../components/delivererPageComponents/Deliveries";
import { useSelector, useDispatch } from "react-redux";
import { switch_deliverer_panel } from "../features/deliverer";

function DelivererPanel() {
  const deliverer = useSelector((state) => state.deliverer.value);
  const dispatch = useDispatch();

  return (
    <>
      <div>DelivererPanel</div>
      <br />
      <button onClick={() => dispatch(switch_deliverer_panel())}>
        {deliverer.panel === "deliveries" ? "historia" : "dostawy"}
      </button>
      {deliverer.panel === "deliveries" && (
        <>
          <h2>Dostawy:</h2>
          <Deliveries />
        </>
      )}
      {deliverer.panel === "history" && (
        <>
          <h2>Historia:</h2>
          <History />
        </>
      )}
    </>
  );
}

export default DelivererPanel;
