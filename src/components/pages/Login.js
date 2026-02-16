import styles from "../UI/Login.module.css";
import Icons from "../icons/Icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../icons/Logo";

function Login() {
  const [status, setStatus] = useState("Login");

  return (
    <div className={`${styles.wrapper} ${styles["login-page"]}`}>
      <Logo size={100} />
      CodeShield
      <div className={styles.container}>
        <div className={styles.Header}>{status}</div>
        {status === "Login" ? (
          <div></div>
        ) : (
          <div className={styles["input-group"]}>
            <div className={styles["input-with-icon"]}>
              <span className={styles["input-icon"]}>
                <Icons icon="MdPerson" size={20} />
              </span>
              <input type="text" placeholder="Name"></input>
            </div>
          </div>
        )}

        <div className={styles["input-group"]}>
          <div className={styles["input-with-icon"]}>
            <span className={styles["input-icon"]}>
              <Icons icon="MdEmail" size={20} />
            </span>
            <input type="text" placeholder="Email"></input>
          </div>
        </div>
        <div className={styles["input-group"]}>
          <div className={styles["input-with-icon"]}>
            <span className={styles["input-icon"]}>
              <Icons icon="MdLock" size={20} />
            </span>
            <input type="password" placeholder="Password"></input>
          </div>
        </div>

        <div className={styles.sign_log_container}>
          {status === "Login" ? (
            <Link to="/home" className={styles.Login}>
              {" "}
              Login
            </Link>
          ) : (
            <div className={styles.SignUp} onClick={() => setStatus("Login")}>
              Sign Up
            </div>
          )}
        </div>

        <div className={styles.PageSwitch}>
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
