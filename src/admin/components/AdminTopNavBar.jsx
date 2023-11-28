// import "../App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { BiBell } from "react-icons/bi";
import "../../styles/Admin.css";
import { Link, useNavigate } from "react-router-dom";
import { UserIconSvg } from "./SVG";

function TopNavbar({ handleFilter,showSearchBar = true }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    const query = e.target.value;
    setSearchQuery(query);
    handleFilter(query);
  };
 
  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light  col-md-10 margin-top">
      <div className="container-md">
        {/* Search Bar */}
        {showSearchBar &&(
        <form className="d-flex mx-auto col-md-6 ">
          <input
            className="form-control me-2 "
            id="responsive-search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <button
            disabled
            className="btn "
            id="responsive-button"
            type="submit"
          >
            Search
          </button>
        </form>
        )}
        {!showSearchBar &&(
          <div className="col-md-10">

          </div>
        )}
        {/* User Dropdown and Bell Icon */}
        <Link className="nav-link " id="bell" to="#">
          <BiBell style={{ fontSize: "20px" }} />
        </Link>
        <div className="d-flex align-items-center  " id="margin-user-icon">
          <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              role="button"
              id="userDropdown"
              onClick={toggleDropdown}
            >
              <UserIconSvg />
            </Link>

            <ul
              className={`dropdown-menu dropdown-menu-end ${
                isDropdownOpen ? "show" : ""
              }`}
              aria-labelledby="userDropdown"
            >
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                >
                  Settings
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  style={{ fontFamily: "sans-serif", fontSize: "13px" }}
                  onClick={logout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNavbar;
