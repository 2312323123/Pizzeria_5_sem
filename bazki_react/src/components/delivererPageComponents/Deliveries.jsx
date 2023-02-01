import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { set_history } from "../../features/deliverer";

function Deliveries() {
  const { history } = useSelector((state) => state.deliverer.value);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    getDeliveries();
  }, []);

  async function getDeliveries() {
    const request = fetch("http://localhost:3001/courier_deliveries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: user.login, password: user.password }),
    });

    const response = await request;
    const text = await response.json();

    dispatch(set_history(text));
  }

  async function delivered(id) {
    const request = fetch("http://localhost:3001/delivered", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: user.login, password: user.password, id }),
    });

    const response = await request;
    const text = await response.json();

    getDeliveries();
  }

  return (
    <>
      <h3>data | nazwa | dostarczono | odległość | czas od / do</h3>
      <ul style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {history.map((element, index) => (
          <li key={index}>
            <span style={{ marginInline: "0.5rem" }}>
              {new Date(Number(element.date)).toISOString()}
            </span>{" "}
            |<span style={{ marginInline: "0.5rem" }}>{element.name}</span> |
            <span style={{ marginInline: "0.5rem" }}>
              {element.distance} km
            </span>{" "}
            |
            <span style={{ marginInline: "0.5rem" }}>
              {new Date(Number(element.courier_start)).toString().slice(0, 33)}
            </span>{" "}
            /
            <span style={{ marginInline: "0.5rem" }}>
              {new Date(Number(element.courier_end)).toString().slice(0, 33)}
            </span>
            |{" "}
            <button
              style={{ marginInline: "0.5rem" }}
              onClick={() => delivered(element.id)}
            >
              dostarczono
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Deliveries;
