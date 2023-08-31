import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [currentView, setCurrentView] = useState("logIn");
  const navigate = useNavigate();
  const changeView = (view) => {
    setCurrentView(view);
  };

  const loginFunc = (e) => {
    e.preventDefault();
    fetch("http://localhost:3333" + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }),
    })
      .then((res) => res.json())
      .then((res) =>
        res.message === undefined
          ? alert("incorrect credentials")
          : navigate("/dashboard")
      );
  };

  const signUpFunc = (e) => {
    fetch("http://localhost:3333" + "/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    })
      .then((res) => res.json())
      .then((res) =>
        res.message === undefined
          ? alert("incorrect credentials")
          : changeView("logIn")
      );
  };

  const currentViewFunc = () => {
    switch (currentView) {
      case "signUp":
        return (
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" required />
                </li>
                <li>
                  <label for="email">Email:</label>
                  <input type="email" id="email" required />
                </li>
                <li>
                  <label for="password">Password:</label>
                  <input type="password" id="password" required />
                </li>
              </ul>
            </fieldset>
            <button onClick={signUpFunc}>Submit</button>
            <button type="button" onClick={() => changeView("logIn")}>
              Have an Account?
            </button>
          </form>
        );
        break;
      case "logIn":
        return (
          <form>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label for="username">Username:</label>
                  <input type="text" id="username" required />
                </li>
                <li>
                  <label for="password">Password:</label>
                  <input type="password" id="password" required />
                </li>
              </ul>
            </fieldset>
            <button onClick={loginFunc}>Login</button>
            <button type="button" onClick={() => changeView("signUp")}>
              Create an Account
            </button>
          </form>
        );
        break;
      case "PWReset":
        return (
          <form>
            <h2>Reset Password</h2>
            <fieldset>
              <legend>Password Reset</legend>
              <ul>
                <li>
                  <em>A reset link will be sent to your inbox!</em>
                </li>
                <li>
                  <label for="email">Email:</label>
                  <input type="email" id="email" required />
                </li>
              </ul>
            </fieldset>
            <button>Send Reset Link</button>
            <button type="button" onClick={() => changeView("logIn")}>
              Go Back
            </button>
          </form>
        );
      default:
        break;
    }
  };

  return <section id="entry-page">{currentViewFunc()}</section>;
}
export default Login;
