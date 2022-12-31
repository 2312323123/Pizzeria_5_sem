import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomerPanel from "./pages/CustomerPanel";
import DelivererPanel from "./pages/DelivererPanel";
import LoginPage from "./pages/LoginPage";
import ManagerPanel from "./pages/ManagerPanel";
import SupplierPanel from "./pages/SupplierPanel";

import { logout } from "./features/user";

function ActualApp() {
  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();

  return (
    <>
      {user.position !== "unauthenticated" && (
        <button style={{ float: "right" }} onClick={() => dispatch(logout())}>
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
