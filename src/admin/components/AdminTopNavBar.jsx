// import React and necessary hooks
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { BiBell } from "react-icons/bi"; // Bell Icon
import "../../styles/Admin.css"; // Custom CSS
import { Link, useNavigate } from "react-router-dom"; // Router functionalities
import { UserIconSvg } from "./SVG"; // Custom User Icon SVG

// Functional component for the top navigation bar
function TopNavbar({ handleFilter, showSearchBar = true }) {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for user dropdown visibility
  const navigate = useNavigate(); // Router navigation functionality

  // Function to toggle the visibility of the user dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle changes in the search bar
  const handleSearchChange = (e) => {
    e.preventDefault();
    const query = e.target.value;
    setSearchQuery(query);
    handleFilter(query);
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    // Top navigation bar structure
    <nav className="navbar navbar-expand-lg navbar-light col-md-10 margin-top">
      <div className="container-md">
        {/* Search Bar */}
        {showSearchBar && (
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
        {!showSearchBar && <div className="col-md-10"></div>}

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

            {/* Dropdown menu for user options */}
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
                {/* Logout option */}
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
