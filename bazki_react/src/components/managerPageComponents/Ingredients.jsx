import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function Ingredients() {
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

  async function edit(id) {
    const product = products.find((product) => product.id === id);
    const name = prompt("nazwa: ", product.name);
    let price = prompt("cena: ", product.price);
    price = Number(price);
    if (isNaN(price)) {
      price = 0;
    }
    const request = fetch("http://localhost:3001/edit_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        id: product.id,
        name,
        price,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      setProducts(
        products.map((the_product) => {
          if (the_product.id === product.id) {
            return { id: product.id, name, price, amount: product.amount };
          }
          return the_product;
        })
      );
    }
  }

  async function remove(id) {
    const request = fetch("http://localhost:3001/delete_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        id,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    }
  }

  async function create() {
    const name = prompt("nazwa: ");
    let amount = prompt("ilość w magazynie: ", 0);
    amount = Number(amount);
    if (isNaN(amount)) {
      amount = 0;
    }
    let price = prompt("cena: ");
    price = Number(price);
    if (isNaN(price)) {
      price = 0;
    }

    const request = fetch("http://localhost:3001/add_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name,
        amount,
        price,
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
            <button style={{ margin: "1rem" }} onClick={() => edit(product.id)}>
              edytuj
            </button>
            <button
              style={{ margin: "1rem" }}
              onClick={() => remove(product.id)}
            >
              usuń
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => create()}>utwórz nowy</button>
    </>
  );
}

export default Ingredients;
