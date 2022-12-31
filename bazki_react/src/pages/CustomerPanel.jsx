import React from "react";
import History from "../components/customerPageComponents/History";
import Menu from "../components/customerPageComponents/Menu";
import { useSelector, useDispatch } from "react-redux";
import { switch_panel } from "../features/customer";

function CustomerPanel() {
  const customer = useSelector((state) => state.customer.value);
  const dispatch = useDispatch();

  return (
    <>
      <div>CustomerPanel</div>
      <br />
      <button onClick={() => dispatch(switch_panel())}>
        {customer.panel === "menu" ? "historia" : "menu"}
      </button>
      {customer.panel === "menu" && (
        <>
          <h2>Menu:</h2>
          <Menu />
        </>
      )}
      {customer.panel === "history" && (
        <>
          <h2>Historia:</h2>
          <History />
        </>
      )}
    </>
  );
}

export default CustomerPanel;
