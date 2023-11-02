// import "../App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { BiBell } from "react-icons/bi";
import "../../styles/Admin.css";
import { useNavigate } from "react-router-dom";
import { UserIconSvg } from "./SVG";

function TopNavbar({handleFilter}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    const query =e.target.value;
    setSearchQuery(query)
    handleFilter(query);
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light  col-md-10 margin-top">
      <div className="container-md">
        {/* Search Bar */}
        <form
          className="d-flex mx-auto col-md-6 "
        >
          <input
            className="form-control me-2 "
            id="responsive-search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <button className="btn " id="responsive-button" type="submit">
            Search  
          </button>
        </form>
        {/* User Dropdown and Bell Icon */}
        <a className="nav-link " id="bell" href="#">
          <BiBell style={{ fontSize: "20px" }} />
        </a>
        <div className="d-flex align-items-center  " id="margin-user-icon">
          <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              id="userDropdown"
              onClick={toggleDropdown}
            >
              <UserIconSvg/>
            </a>

            <ul
              className={`dropdown-menu dropdown-menu-end ${
                isDropdownOpen ? "show" : ""
              }`}
              aria-labelledby="userDropdown"
            >
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                >
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                  onClick={logout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
