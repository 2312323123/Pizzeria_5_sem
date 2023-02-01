import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomerPanel from "./pages/CustomerPanel";
import DelivererPanel from "./pages/DelivererPanel";
import LoginPage from "./pages/LoginPage";
import ManagerPanel from "./pages/ManagerPanel";
import SupplierPanel from "./pages/SupplierPanel";
import "./styles/index.css";

import { logout } from "./features/user";
import { reset_history } from "./features/customer";
import {
  reset_history as reset_history_deliverer,
  reset_deliveries,
} from "./features/deliverer";

function ActualApp() {
  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();

  return (
    <>
      {user.position !== "unauthenticated" && (
        <button
          style={{ float: "right" }}
          onClick={() => {
            dispatch(logout());
            dispatch(reset_history());
            dispatch(reset_history_deliverer());
            dispatch(reset_deliveries());
          }}
        >
          wyloguj
        </button>
      )}
      {user.position === "unauthenticated" && <LoginPage />}
      {user.position === "customer" && <CustomerPanel />}
      {user.position === "deliverer" && <DelivererPanel />}
      {user.position === "manager" && <ManagerPanel />}
      {user.position === "supplier" && <SupplierPanel />}
    </>
  );
}

export default ActualApp;
