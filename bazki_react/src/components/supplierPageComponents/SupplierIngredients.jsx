import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function SupplierIngredients() {
  const user = useSelector((state) => state.user.value);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const request = fetch("http://localhost:3001/ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: user.login, password: user.password }),
    });

    const response = await request;
    const text = await response.json();

    setProducts(text);
  }

  async function add(id) {
    const product = products.find((product) => product.id === id);
    let amount = prompt("ilość: ");
    amount = Number(amount);
    if (isNaN(amount)) {
      amount = 0;
    }
    const request = fetch("http://localhost:3001/supply_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        id: product.id,
        amount,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    }
  }

  return (
    <>
      <h3>ID | nazwa | cena (kg) | ilość w magazynie</h3>
      <ul style={{ maxHeight: "50vh", overflowY: "scroll" }}>
        {products.map((product, id) => (
          <li key={id}>
            <span style={{ margin: "1rem" }}>{product.id}</span> |
            <span style={{ margin: "1rem" }}>{product.name}</span> |{" "}
            <span style={{ margin: "1rem" }}>{product.price}</span> |
            <span style={{ margin: "1rem" }}>{product.amount} </span> |
            <span style={{ margin: "1rem" }}></span>
            <button style={{ margin: "1rem" }} onClick={() => add(product.id)}>
              dodaj
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SupplierIngredients;
