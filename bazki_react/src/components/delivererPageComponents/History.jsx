import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { set_history } from "../../features/deliverer";

function History() {
  const { history } = useSelector((state) => state.deliverer.value);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    getHistory();
  }, []);

  async function getHistory() {
    const request = fetch("http://localhost:3001/courier_history", {
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

  return (
    <>
      <h3>data | nazwa | dostarczono | cena | odległość</h3>
      <ul style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {history.map((element, index) => (
          <li key={index}>
            <span style={{ marginInline: "0.5rem" }}>
              {new Date(Number(element.date)).toISOString()}
            </span>{" "}
            |<span style={{ marginInline: "0.5rem" }}>{element.name}</span> |
            <span style={{ marginInline: "0.5rem" }}>
              {element.delivered ? "tak" : "nie"}
            </span>{" "}
            |<span style={{ marginInline: "0.5rem" }}>{element.price} zł</span>|
            <span style={{ marginInline: "0.5rem" }}>
              {element.distance} km
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default History;
