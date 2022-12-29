import React, { useEffect, useRef, useState } from "react";

function SingleUser(props) {
  const { user } = props;

  const selectRef = useRef(null);

  const [selection, setSelection] = useState("lol");

  useEffect(() => {
    setSelection(selectRef.current.value);
  }, []);

  async function edit(id, position, event) {
    const newSelection = event.target.value;
    selectRef.current.value = selection;

    // jak pyknie to
    // setSelection(newSelection)
    // event.target.value = newSelection

    const request = fetch("http://localhost:3001/edit_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        id: id,
        position,
      }),
    });

    const response = await request;
    // const text = await response.json();

    // if (text === true) {
    //   getUsers();
    // }
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
      getUsers();
    }
  }

  return (
    <li>
      <span style={{ margin: "1rem" }}>{user.login}</span> |
      <select
        defaultValue={user.position}
        onInput={(e) => edit(user.id, e.target.value, e)}
        style={{ margin: "1rem" }}
        ref={selectRef}
      >
        <option>customer</option>
        <option>deliverer</option>
        <option>supplier</option>
        <option>manager</option>
      </select>{" "}
      |
      <button style={{ margin: "1rem" }} onClick={() => alert(selection)}>
        usuń
      </button>
    </li>
  );
}

export default SingleUser;
