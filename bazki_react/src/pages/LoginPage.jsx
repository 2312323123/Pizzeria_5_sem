import React, { useRef, useState } from "react";

function LoginPage() {
  const loginRef1 = useRef(null);
  const passwordRef1 = useRef(null);
  const loginRef2 = useRef(null);
  const passwordRef2 = useRef(null);

  const [login1, setLogin1] = useState("");
  const [password1, setPassword1] = useState("");
  const [login2, setLogin2] = useState("");
  const [password2, setPassword2] = useState("");

  const [processingRequest, setProcessingRequest] = useState(false);

  function registerSubmit() {
    setProcessingRequest(true);
  }

  function loginSubmit() {
    setProcessingRequest(true);
  }

  function login() {
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
    <>
      <h2>Sign in</h2>
      <form>
        <label>
          login: {login1}
          <br />
          <input
            type="text"
            value={login1}
            onInput={(e) => setLogin1(e.target.value)}
            ref={loginRef1}
          />
        </label>
        <br />
        <label>
          password: <br />
          <input
            type="password"
            value={password1}
            onInput={(e) => setPassword1(e.target.value)}
            ref={passwordRef1}
          />{" "}
        </label>
        <br />
        <input
          type="submit"
          onClick={loginSubmit}
          disabled={processingRequest}
        />
      </form>
      <h2>or</h2>
      <h2>Register</h2>
      <form>
        <label>
          login: <br />
          <input
            type="text"
            value={login2}
            onInput={(e) => setLogin2(e.target.value)}
            ref={loginRef2}
          />
        </label>
        <br />
        <label>
          password: <br />
          <input
            type="password"
            value={password2}
            onInput={(e) => setPassword2(e.target.value)}
            ref={passwordRef2}
          />{" "}
        </label>
        <br />
        <input
          type="submit"
          onClick={registerSubmit}
          disabled={processingRequest}
        />
      </form>
    </>
  );
}

export default LoginPage;
