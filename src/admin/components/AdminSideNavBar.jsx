import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Admin.css";

export default function NavigationBar() {
  return (
    <>
      {/* Sidebar navigation */}
      <nav className="col-md-2 d-md-block sidebar nav-back">
        <div className="position-sticky">
          {/* Navigation list */}
          <ul className="nav flex-column">
            {/* Logo */}
            <li className="nav-item logo-container">
              <Link to="#" className="nav-link active">
                <div className="logo"></div>
              </Link>
            </li>
            {/* Dashboard */}
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            {/* Category Management */}
            <li className="nav-item">
              <Link to="/admin/category" className="nav-link">
                Category Management
              </Link>
            </li>
            {/* Product Management */}
            <li className="nav-item">
              <Link to="/admin/product" className="nav-link">
                Product Management
              </Link>
            </li>
            {/* Variants */}
            <li className="nav-item">
              <Link to="/admin/varients" className="nav-link">
                Varients
              </Link>
            </li>
            {/* User Management */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                User Management
              </Link>
            </li>
            {/* Order Management */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Order Management
              </Link>
            </li>
            {/* Transactions */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Transactions
              </Link>
            </li>
            {/* Promotions */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Promotions
              </Link>
            </li>
            {/* Notifications */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Notifications
              </Link>
            </li>
            {/* FAQ */}
            <li className="nav-item">
              <Link to="#" className="nav-link">
                FAQ
              </Link>
            </li>
            {/* Dropdown for Static Pages */}
            <li className="nav-item dropdown">
              <Link
                to="#"
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Static Pages
              </Link>
              {/* Dropdown menu */}
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {/* About us */}
                <Link to="#" className="dropdown-item">
                  About us
                </Link>
                {/* Terms and Conditions */}
                <Link to="#" className="dropdown-item">
                  Terms and Conditions
                </Link>
                <div className="dropdown-divider"></div>
                {/* Privacy Policy */}
                <Link to="#" className="dropdown-item">
                  Privacy Policy
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
