import React, { useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { login_action } from "../features/user";

function LoginPage() {
  const dispatch = useDispatch();

  const loginRef1 = useRef(null);
  const passwordRef1 = useRef(null);
  const loginRef2 = useRef(null);
  const passwordRef2 = useRef(null);

  const [login1, setLogin1] = useState("");
  const [password1, setPassword1] = useState("");
  const [login2, setLogin2] = useState("");
  const [password2, setPassword2] = useState("");

  const [processingRequest, setProcessingRequest] = useState(false);

  async function loginSubmit(e) {
    e.preventDefault();
    setProcessingRequest(true);

    const login = login1;
    const password = password1;

    const request = fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const response = await request;
    const text = await response.json();
    // const text = response.text
    if (text.position === "unauthenticated") {
      console.log("tell user about wrong login here");
    } else {
      dispatch(
        login_action({
          login,
          password,
          position: text.position,
        })
      );
    }

    setProcessingRequest(false);
  }

  async function registerSubmit(e) {
    e.preventDefault();
    setProcessingRequest(true);

    const login = login2;
    const password = password2;

    const request = fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const response = await request;
    const text = await response.json();
    // const text = response.text
    if (text.position === "unauthenticated") {
      console.log("tell user about wrong register here");
    } else {
      console.log("position: " + text.position);
      dispatch(
        login_action({
          login,
          password,
          position: text.position,
        })
      );
    }

    setProcessingRequest(false);
  }

  function lolgin() {
    let name = prompt("Enter merchant name");
    let email = prompt("Enter merchant email");
    fetch("http://localhost:3001/merchants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        alert(data);
        getMerchant();
      });
  }

  return (
    <div style={{ maxWidth: "50%", marginInline: "auto" }}>
      <h2>Sign in</h2>
      <form>
        <label htmlFor="login1Input">login: {login1}</label>
        <br />
        <input
          id="login1Input"
          type="text"
          value={login1}
          onInput={(e) => setLogin1(e.target.value)}
          ref={loginRef1}
        />
        <br />
        <label htmlFor="password1Input">password:</label>
        <br />
        <input
          id="password1Input"
          type="password"
          value={password1}
          onInput={(e) => setPassword1(e.target.value)}
          ref={passwordRef1}
        />{" "}
        <br />
        <input
          type="submit"
          onClick={(event) => loginSubmit(event)}
          disabled={processingRequest}
        />
      </form>
      <h2>or</h2>
      <h2>Register</h2>
      <form>
        <label htmlFor="login2Input">login:</label>
        <br />
        <input
          id="login2Input"
          type="text"
          value={login2}
          onInput={(e) => setLogin2(e.target.value)}
          ref={loginRef2}
        />
        <br />
        <label htmlFor="password2Input">password:</label>
        <br />
        <input
          id="password2Input"
          type="password"
          value={password2}
          onInput={(e) => setPassword2(e.target.value)}
          ref={passwordRef2}
        />{" "}
        <br />
        <input
          type="submit"
          onClick={(event) => registerSubmit(event)}
          disabled={processingRequest}
        />
      </form>
    </div>
  );
}

export default LoginPage;
