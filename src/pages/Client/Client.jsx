import React, { useEffect, useState, useContext, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faHome, faFilm, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "./../../context/context";
import "./Client.css";

function Client() {
  const { auth } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
        <header>
          <h1 className="title-text">
            +NETMOVIES
          </h1>
        </header>

        {/* Sidebar */}
              <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header" onClick={toggleSidebar}>
          {isCollapsed ? "≡" : "+NETMOVIES"}
        </div>
        <div className="container-user-info">
          <FontAwesomeIcon icon={faUserCircle} className="photo-user-img" />
          <h1 className="name-user">{auth.user?.firstName || "Guest"}</h1>
          <p className="role-user">Role: <strong>{auth.user?.role || "N/A"}</strong></p>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/home")}>
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </li>
          <li onClick={() => navigate("/home/movie/:movieId?")}>
            <FontAwesomeIcon icon={faFilm} />
            <span>Movies</span>
          </li>
        </ul>
        <div className="sidebar-footer" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </div>
      </div>
        {/* End Sidebar */}

        <article className="main-content">
          <Outlet />
        </article>

        <footer>
          <div className="text-rights">
            <p className="size-font">
              &copy; 2024 +NETMOVIES - All rights reserved.
              Data provided by{" "}
              <a
                className="link-color"
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Movie Database (TMDB)
              </a>
            </p>
            <p className="size-font">
              Developed and Created by Romce Angelo R. Cañete from BSIT - 3A
            </p>
          </div>
          <div className="icons"></div>
        </footer>
      </main>
    </>
  );
}

export default Client;
