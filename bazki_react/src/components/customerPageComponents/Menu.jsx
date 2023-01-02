import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  update_products,
  start_making_order,
  end_making_order,
  set_predicted_time,
  set_distance,
} from "../../features/customer";
import SingleMenuProduct from "./SingleMenuProduct";

function Menu() {
  const user = useSelector((state) => state.user.value);
  const { products, making_order, current_order, predicted_time, distance } =
    useSelector((state) => state.customer.value);
  const dispatch = useDispatch();

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const request = fetch("http://localhost:3001/customer_menu", {
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
        ingredients: ingredients.map((obj) => obj.name),
        price: Number(x.price),
      });
    }

    // console.log(processed);
    dispatch(update_products(processed));
  }

  async function evaluate_time(dist) {
    let distance = Number(dist);
    if (isNaN(distance)) {
      return;
    }
    if (distance < 0) {
      return;
    }

    dispatch(set_distance(distance));

    const request = fetch("http://localhost:3001/evaluate_delivery_time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        distance,
      }),
    });

    const response = await request;
    const text = await response.json();

    dispatch(
      set_predicted_time(
        isNaN(Math.round((new Date(text.time).getTime() - Date.now()) / 60000))
          ? "dostawa niemożliwa"
          : Math.round((new Date(text.time).getTime() - Date.now()) / 60000)
      )
    );
  }

  const order = async () => {
    console.log(distance);

    const request = fetch("http://localhost:3001/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        name: current_order.value.name,
        distance: distance,
      }),
    });

    // const response = await request;
    // const text = await response.json();

    dispatch(end_making_order());
  };

  return (
    <>
      {!making_order && (
        <div>
          <h4>Menu</h4>
          <h3>nazwa || ( składniki ) || cena</h3>
          {/* {JSON.stringify(products)} */}
          <ul style={{ maxHeight: "50vh", overflowY: "scroll" }}>
            {products.map((product, id) => (
              <SingleMenuProduct
                key={id}
                product={product}
                getProducts={getProducts}
              />
            ))}
          </ul>
          {/* <button onClick={() => create()}>utwórz nowy</button> */}
        </div>
      )}
      {making_order && (
        <div>
          <h4>zamawiasz:</h4>
          <h3>nazwa produktu: {current_order.value.name}</h3>
          <h3>cena: {current_order.value.price} zł</h3>
          <h3 onInput={(e) => evaluate_time(e.target.value)}>
            odległość [km] (wymagana):{" "}
            <input size="10" style={{ fontSize: "1rem" }} />
          </h3>
          <h3>
            przewidywana dostawa za:{" "}
            {typeof predicted_time === "string"
              ? predicted_time
              : predicted_time + " minut(y)"}
          </h3>
          <button onClick={order}>zamów</button>
          <button
            style={{ float: "right" }}
            onClick={() => dispatch(end_making_order())}
          >
            powrót
          </button>
        </div>
      )}
    </>
  );
}

export default Menu;
