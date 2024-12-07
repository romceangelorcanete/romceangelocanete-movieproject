import React, { useEffect, useContext, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome,faFilm,faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "./../../context/context";
import "./Client.css";

function Client() {
  const { auth } = useContext(AuthContext);
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/"); // Navigate to the login page after logout
  }, [navigate]);

  useEffect(() => {
    if (!auth.accessToken) {
      handleLogout();
    }
  }, [auth.accessToken, handleLogout]);

  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    header.classList.add("header-visible");
    footer.classList.add("footer-visible");
  }, []);

  return (
    <>
      <main className="box">
                          <header className="header-visible">
                      {/* Title on the Left */}
                      <div className="title-text">
                        +NETMOVIES
                      </div>

                      {/* Centered Navigation */}
                      <nav className="nav-menu">
                        <li onClick={() => navigate("/home")}>
                          <FontAwesomeIcon icon={faHome} />
                          <span>Home</span>
                        </li>
                        <li onClick={() => navigate(`/home`)}>
                          <FontAwesomeIcon icon={faFilm} />
                          <span>Movies</span>
                        </li>
                      </nav>

                      {/* User Info and Logout on the Right */}
                      <div className="header-right">
                        <div className="user-info">
                          <p className="name-user">{auth.user?.firstName || "Guest"}</p>
                          <p className="role-user">Role: <strong>{auth.user?.role || "N/A"}</strong></p>
                        </div>

                        <div className="logout-btn" onClick={handleLogout}>
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </div>
                      </div>
                    </header>
        {/* End Header */}

        <article className="main-content">
          <Outlet />
        </article>

        {/* Footer */}
                <footer>
          <div className="footer-container">
            <p className="footer-text">
              &copy; 2024 +NETMOVIES - All rights reserved. Data provided by{" "}
              <a style={{marginRight:'5px'}}
                className="footer-link"
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Movie Database (TMDB)
              </a>
              Developed by <strong>Romce Angelo R. Cañete</strong> from BSIT - 3A
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Client;
