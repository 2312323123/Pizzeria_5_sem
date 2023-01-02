import React, { useEffect } from "react";
import SingleProduct from "./SingleProduct";
import { useSelector, useDispatch } from "react-redux";
import { update_products } from "../../features/manager_product";

function Products() {
  const user = useSelector((state) => state.user.value);
  const products = useSelector((state) => state.manager_product.value);
  const dispatch = useDispatch();

  useEffect(() => {
    getProducts();
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
    <>
      <h3>
        nazwa || ( id_składnika, nazwa_składnika, ilość_składnika ) || cena
        składników | cena
      </h3>
      {/* {JSON.stringify(products)} */}
      <ul style={{ maxHeight: "50vh", overflowY: "scroll" }}>
        {products.products.map((product, id) => (
          <SingleProduct key={id} product={product} getProducts={getProducts} />
        ))}
      </ul>
      <button onClick={() => create()}>utwórz nowy</button>
    </>
  );
}

export default Products;
