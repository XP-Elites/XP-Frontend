import "../UI/Login.css";
import Icons from "../icons/Icons";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [status, setStatus] = useState("Login");

  return (
    <div className="wrapper login-page">
      <div className="container">
        <div className="Header">{status}</div>
        {status === "Login" ? (
          <div></div>
        ) : (
          <div className="input-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <Icons icon="MdPerson" size={20} />
              </span>
              <input type="text" placeholder="Name"></input>
            </div>
          </div>
        )}

        <div className="input-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <Icons icon="MdEmail" size={20} />
            </span>
            <input type="text" placeholder="Email"></input>
          </div>
        </div>
        <div className="input-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <Icons icon="MdLock" size={20} />
            </span>
            <input type="password" placeholder="Password"></input>
          </div>
        </div>

        <div className="sign_log_container">
          {status === "Login" ? (
            <Link to="/home" className="Login">
              {" "}
              Login
            </Link>
          ) : (
            <Link to="/home" className="SignUp">
              Sign Up
            </Link>
          )}
        </div>

        <div className="PageSwitch">
          {status === "Login" ? (
            <span>
              Don't have an account?{" "}
              <span
                style={{ color: "rgb(150, 180, 220)", cursor: "pointer" }}
                onClick={() => setStatus("Sign Up")}
              >
                Sign Up
              </span>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <span
                style={{ color: "rgb(150, 180, 220)", cursor: "pointer" }}
                onClick={() => setStatus("Login")}
              >
                Login
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
