import React from "react";
import { useDispatch } from "react-redux";
import { start_making_order } from "../../features/customer";

function SingleMenuProduct(props) {
  const product = props.product;
  const dispatch = useDispatch();

  return (
    <li>
      <span style={{ marginInlineStart: "1rem" }}>{product.name}</span> ||
      <div
        style={{
          display: "inline-block",
          position: "relative",
          verticalAlign: "bottom",
          margin: "0.5rem 1rem",
        }}
      >
        {product.ingredients.map((ingredient, index) => (
          <span key={index}>
            (<span style={{ margin: "1rem" }}>{ingredient}</span>) <br />
          </span>
        ))}
      </div>{" "}
      ||
      <span style={{ margin: "1rem" }}>{product.price} zł</span> |
      <button
        style={{ margin: "1rem" }}
        onClick={() =>
          dispatch(
            start_making_order({
              value: { name: product.name, price: product.price },
            })
          )
        }
      >
        zamów
      </button>
    </li>
  );
}

export default SingleMenuProduct;
