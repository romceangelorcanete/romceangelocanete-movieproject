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
      if (!email || !password) {
        setIsFieldsDirty(true);
        email === "" && emailRef.current.focus();
        password === "" && passwordRef.current.focus();
        setIsError(true); // Indicate an error state
        setAlertMessage("Please fill in all required fields.");
        return;
      }
    
      const data = { email, password };
      setStatus("loading");
    
      try {
        const res = await axios.post(apiEndpoint, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
        });
    
        // Save tokens and user details
        localStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    
        // Update Auth Context
        setAuthData({
          accessToken: res.data.access_token,
          user: res.data.user,
        });
    
        setIsError(false); // Success state
        setAlertMessage(res.data.message || "Login successful!");
    
        setTimeout(() => {
          // Navigate based on role
          if (res.data.user.role === "admin") {
            navigate("/main/dashboard"); // Admin dashboard
          } else {
            setIsError(true); // Non-admin login attempt to admin resources
            setAlertMessage("You are not authorized to access admin resources.");
            localStorage.clear(); // Clear localStorage to remove unwanted access
          }
          setStatus("idle");
        }, 3000);
      } catch (e) {
        setIsError(true); // Error state
        setAlertMessage(e.response?.data?.message || "Invalid email or password.");
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
      <div className="m-container">
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

            <div className="form-group1">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, "email")}
              />
              {debounceState && isFieldsDirty && email === "" && (
                <span className="errors">Please enter a valid email.</span>
              )}
            </div>

            <div className="form-group1">
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
                <span className="errors">Your password must contain between 4 and 60 characters.</span>
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
