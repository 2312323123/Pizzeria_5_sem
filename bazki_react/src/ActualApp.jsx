import React from "react";
import { useSelector } from "react-redux";
import CustomerPanel from "./pages/CustomerPanel";
import DelivererPanel from "./pages/DelivererPanel";
import LoginPage from "./pages/LoginPage";
import ManagerPanel from "./pages/ManagerPanel";
import SupplierPanel from "./pages/SupplierPanel";

function ActualApp() {
  const user = useSelector((state) => state.user.value);

  return (
    <>
      {user.position == "unauthenticated" && <LoginPage />}
      {user.position == "customer" && <CustomerPanel />}
      {user.position == "deliverer" && <DelivererPanel />}
      {user.position == "manager" && <ManagerPanel />}
      {user.position == "supplier" && <SupplierPanel />}
    </>
  );
}

export default ActualApp;
