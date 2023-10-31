// import "../App.css"
import React from "react";
import { Link } from 'react-router-dom';
import  "../../styles/Admin.css";



export default function NavigationBar() {
  return (
 <>   
    <nav className="col-md-2 d-md-block  sidebar  nav-back">
      <div className="position-sticky">
        <ul className="nav flex-column">
        <li className="nav-item">
            <a className="nav-link active" href="#">
            <div className="logo-container logo ">
      </div>
            </a>
          </li>
          <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link><br/>
          </li>
          <li className="nav-item">
          <Link to="/admin/category" className="nav-link">
            Category Management
          </Link>
        </li>
          <li className="nav-item">
          <Link to="/admin/product" className="nav-link">
            Product Managment
          </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              User Management
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Order Management
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Transactions
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Promotions
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Notifications
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              FAQ
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Static Pages
            </a>
            <div className="dropdown-menu " aria-labelledby="navbarDropdown">
              <a className="dropdown-item " href="#" style={{fontFamily:'sans-serif', fontSize:'13px'}}>
                About us
              </a>
              <a className="dropdown-item"style={{fontFamily:'sans-serif', fontSize:'13px'}} href="#">
                Terms and Conditions
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item"  style={{fontFamily:'sans-serif', fontSize:'13px'}}href="#">
                Privacy Policy
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  


</>

  );
;}
