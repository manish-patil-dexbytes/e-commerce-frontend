import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Admin.css";

export default function NavigationBar() {
  return (
    <>
      <nav className="col-md-2 d-md-block sidebar nav-back">
        <div className="position-sticky">
          <ul className="nav flex-column">
            <li className="nav-item logo-container">
              <Link to="#" className="nav-link active">
                <div className="logo"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/category" className="nav-link">
                Category Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/product" className="nav-link">
                Product Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/varients" className="nav-link">
                Varients
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                User Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Order Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Promotions
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                FAQ
              </Link>
            </li>
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
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="#" className="dropdown-item">
                  About us
                </Link>
                <Link to="#" className="dropdown-item">
                  Terms and Conditions
                </Link>
                <div className="dropdown-divider"></div>
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
