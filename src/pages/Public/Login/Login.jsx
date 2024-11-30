import { useState, useRef, useCallback, useEffect, useContext } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";
import { AuthContext } from "../../../context/context";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const { setAuthData, auth } = useContext(AuthContext);

  const [alertMessage, setAlertMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const apiEndpoint = window.location.pathname.includes("/admin")
    ? "/admin/login"
    : "/user/login";

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");

    try {
      const res = await axios.post(apiEndpoint, data, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });

      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAuthData({
        accessToken: res.data.access_token,
        user: res.data.user,
      });

      setIsError(false);
      setAlertMessage(res.data.message || "Login successful!");
      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/main/dashboard" : "/home"); // /home this user login
        setStatus("idle");
      }, 3000);
    } catch (e) {
      setIsError(true);
      setAlertMessage(e.response?.data?.message || e.message);
      setTimeout(() => {
        setAlertMessage("");
        setStatus("idle");
      }, 3000);
    }
  };

 // Correctly using auth from context
 useEffect(() => {
  console.log('Auth State Updated:', auth);
}, [auth]); // Now listening to auth changes

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        {alertMessage && (
          <div className={`alert-box ${isError ? "error" : "success"}`}>
            {alertMessage}
          </div>
        )}
        <form>
          <div className="form-container">
            <div className="login-header">
              <h1>
                WELCOME TO <span>NETMOVIES+</span>
              </h1>
              <p>
                NetMovies+ is the streaming home for movies and series from
                Disney, Marvel, Star Wars, and Star.
              </p>
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, "email")}
              />
              {debounceState && isFieldsDirty && email === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <div>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, "password")}
                />
                <span
                  className={`fas ${
                    isShowPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                  id="icon-toggle"
                  onClick={handleShowPassword}
                />
              </div>
              {debounceState && isFieldsDirty && password === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="submit-container">
              <button
                type="button"
                disabled={status === "loading"}
                onClick={() => {
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    email === "" && emailRef.current.focus();
                    password === "" && passwordRef.current.focus();
                  }
                }}
              >
                {status === "idle" ? "Login" : "Loading"}
              </button>
            </div>

            <div className="register-container">
              <small>
                Don't have an account? <a href="/register">Register</a>
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
