import React from "react";
import Ingredients from "../components/managerPageComponents/Ingredients";
import Products from "../components/managerPageComponents/Products";
import Users from "../components/managerPageComponents/Users";

function ManagerPanel() {
  return (
    <>
      <div>ManagerPanel</div>
      <h2>Produkty:</h2>
      <Products />
      <hr />
      <h2>Składniki:</h2>
      <Ingredients />
      <hr />
      <h2>Użytkownicy:</h2>
      <Users />
    </>
  );
}

export default ManagerPanel;
