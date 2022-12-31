import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_products } from "../../features/manager_product";

function Ingredients() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getIngredients();
  }, []);

  async function getProducts() {
    const request = fetch("http://localhost:3001/get_products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: user.login, password: user.password }),
    });

    const response = await request;
    const text = await response.json();

    const processed = [];

    for (const x of text.prices) {
      const name = x.name;
      const ingredients = text.ingredients.filter(
        (ingredient) => ingredient.menu_name === name
      );
      processed.push({
        name: x.name,
        ingredients: ingredients.map((obj) => ({
          id: obj.id,
          name: obj.name,
          amount: obj.amount,
        })),
        product_price: Number(x.product_price),
        price: Number(x.price),
      });
    }

    dispatch(update_products(processed));
  }

  async function getIngredients() {
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
      await getProducts();

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
      await getProducts();
      getIngredients();
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
      getIngredients();
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
