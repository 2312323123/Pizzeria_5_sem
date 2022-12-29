import React from "react";
import Ingredients from "../components/managerPageComponents/Ingredients";
import Users from "../components/managerPageComponents/Users";

function ManagerPanel() {
  return (
    <>
      <div>ManagerPanel</div>
      <h2>Produkty:</h2>
      <h2>Składniki:</h2>
      <Ingredients />
      <h2>Użytkownicy:</h2>
      <Users />
    </>
  );
}

export default ManagerPanel;
