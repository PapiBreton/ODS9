import { NavLink } from "react-router";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logo */}
        <span className="navbar-brand fw-bold d-flex align-items-center">
          <i className="bi bi-emoji-smile nav-icon text-warning "></i>
          ODS-9
        </span>
        {/* Bouton burger mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Liens */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item">
              <NavLink
                to="/dico"
                className={({ isActive }) =>
                  `nav-link hover-underline ${isActive ? "active" : ""}`
                }
              >
                Dico
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/prefix"
                className={({ isActive }) =>
                  `nav-link hover-underline ${isActive ? "active" : ""}`
                }
              >
                Préfixes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/listePrefixes"
                className={({ isActive }) =>
                  `nav-link hover-underline ${isActive ? "active" : ""}`
                }
              >
                Liste Préfixes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/recherche"
                className={({ isActive }) =>
                  `nav-link hover-underline ${isActive ? "active" : ""}`
                }
              >
                Rajouts
              </NavLink>
            </li>
          </ul>

          {/* Recherche */}
          <form className="d-flex" role="search">
            <input
              id="searchInputNavbar"
              className="form-control me-2"
              type="search"
              placeholder="Rechercher..."
              aria-label="Search"
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
