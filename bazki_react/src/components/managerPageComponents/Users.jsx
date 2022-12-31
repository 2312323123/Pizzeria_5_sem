import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SingleUser from "./SingleUser";

function Users() {
  const user = useSelector((state) => state.user.value);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const request = fetch("http://localhost:3001/get_users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login: user.login, password: user.password }),
    });

    const response = await request;
    const text = await response.json();

    setUsers(text);
  }

  return (
    <>
      <h3>login | position</h3>
      <ul style={{ maxHeight: "50vh", overflowY: "scroll" }}>
        {users.map((one_user, id) => (
          <SingleUser key={id} the_user={one_user} getUsers={getUsers} />
        ))}
      </ul>
    </>
  );
}

export default Users;
