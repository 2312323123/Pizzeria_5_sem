import React from "react";
import { useSelector } from "react-redux";

function SingleProduct(props) {
  const product = props.product;
  const user = useSelector((state) => state.user.value);
  const getProducts = props.getProducts;

  async function change_product_name() {
    const new_name = prompt("nowa nazwa: ", product.name);
    if (!new_name) {
      return;
    }

    const request = fetch("http://localhost:3001/change_product_name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: product.name,
        new_name,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("product name already taken or smth");
    }
  }

  async function new_ingredient() {
    const id = prompt("id: ");
    if (!id) {
      return;
    }
    const amount = prompt("ilość: ");
    if (!amount) {
      return;
    }

    const request = fetch("http://localhost:3001/add_product_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: product.name,
        id,
        amount,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("ingredient already exists or smth");
    }
  }

  async function change_product_ingredient_amount(id, current_amount) {
    let amount = prompt("nowa ilość: ", current_amount);
    if (!amount) {
      return;
    }
    amount = Number(amount);
    if (isNaN(amount)) {
      return;
    }

    const request = fetch(
      "http://localhost:3001/change_product_ingredient_amount",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: user.login,
          password: user.password,
          name: product.name,
          id,
          amount,
        }),
      }
    );

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("ingredient doesn't exist yet or smth");
    }
  }

  async function delete_product_ingredient(id) {
    const request = fetch("http://localhost:3001/delete_product_ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: product.name,
        id,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("ingredient doesn't exist yet or smth");
    }
  }

  async function change_product_price() {
    let price = prompt("nowa cena: ", product.price);
    if (!price) {
      return;
    }
    price = Number(price);
    if (isNaN(price)) {
      return;
    }

    const request = fetch("http://localhost:3001/change_product_price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: product.name,
        price,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("ingredient doesn't exist yet or smth");
    }
  }

  async function delete_product() {
    const request = fetch("http://localhost:3001/delete_product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: product.name,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("product doesn't exist yet or smth");
    }
  }

  async function create() {
    const name = prompt("nazwa produktu: ");
    if (!name) {
      return;
    }
    const id = prompt("id pierwszego składnika: ");
    if (!id) {
      return;
    }
    let amount = prompt("ilość pierwszego składnika: ");
    if (!amount) {
      return;
    }
    amount = Number(amount);
    if (isNaN(amount)) {
      alert("zły format ilości!");
      return;
    }

    const request = fetch("http://localhost:3001/add_product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name,
        id,
        amount,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      getProducts();
    } else {
      alert("product name already taken wrong id or smth");
    }
  }

  return (
    <li>
      <span style={{ marginInlineStart: "1rem" }}>{product.name}</span>{" "}
      <button style={{ marginInline: "0.5rem" }} onClick={change_product_name}>
        zmień
      </button>{" "}
      ||
      <div
        style={{
          display: "inline-block",
          position: "relative",
          verticalAlign: "top",
          margin: "0.5rem 1rem",
        }}
      >
        {product.ingredients.map((ingredient, index) => (
          <span key={index}>
            ( <span style={{ marginInlineEnd: "1rem" }}>{ingredient.id}</span> |
            <span style={{ margin: "1rem" }}>{ingredient.name}</span> |
            <span style={{ marginInlineStart: "1rem" }}>
              {ingredient.amount}{" "}
              <button
                onClick={() =>
                  change_product_ingredient_amount(
                    ingredient.id,
                    ingredient.amount
                  )
                }
              >
                zmień
              </button>
            </span>{" "}
            ){" "}
            <button
              style={{ marginInlineStart: "1rem" }}
              onClick={() => delete_product_ingredient(ingredient.id)}
            >
              usuń
            </button>
            <br />
          </span>
        ))}
        <button onClick={new_ingredient}>dodaj</button>
      </div>{" "}
      ||
      <span style={{ margin: "1rem" }}>{product.product_price} zł</span> |
      <span style={{ margin: "1rem" }}>{product.price} zł</span>{" "}
      <button
        style={{ marginInlineEnd: "0.5rem" }}
        onClick={change_product_price}
      >
        zmień
      </button>{" "}
      |
      <button style={{ margin: "1rem" }} onClick={delete_product}>
        usuń
      </button>
    </li>
  );
}

export default SingleProduct;
