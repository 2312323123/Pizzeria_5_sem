import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function SingleUser(props) {
  const user = useSelector((state) => state.user.value);

  const selectRef = useRef(null);

  const [selection, setSelection] = useState("lol");

  useEffect(() => {
    setSelection(selectRef.current.value);
  }, []);

  async function edit(position, event) {
    const newSelection = event.target.value;
    selectRef.current.value = selection;

    const request = fetch("http://localhost:3001/edit_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        loginToEdit: props.the_user.login,
        position,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      setSelection(newSelection);
      event.target.value = newSelection;
    } else {
      alert(text.message);
    }
  }

  async function remove() {
    console.log(props.the_user);
    const request = fetch("http://localhost:3001/delete_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        user_login: props.the_user.login,
      }),
    });

    const response = await request;
    const text = await response.json();

    if (text === true) {
      props.getUsers();
    }
  }

  return (
    <li>
      <span style={{ margin: "1rem" }}>{props.the_user.login}</span> |
      <select
        defaultValue={props.the_user.position}
        onInput={(e) => edit(e.target.value, e)}
        style={{ margin: "1rem" }}
        ref={selectRef}
      >
        <option>customer</option>
        <option>deliverer</option>
        <option>supplier</option>
        <option>manager</option>
      </select>{" "}
      |
      <button style={{ margin: "1rem" }} onClick={remove}>
        usuń
      </button>
    </li>
  );
}

export default SingleUser;
