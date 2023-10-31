import "../../styles/Admin.css";
import React, { useState } from "react";
import AdminDashBoard from "../admin-dashboard/AdminDashboard";
import { useNavigate, Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import {
  validatePassword,
  validateText,
  validateEmail,
} from "../../helpers/validations";

export default function AdminLogin() {
  const [email, setEmail] = useState(""); //state to  set email
  const [password, setPassword] = useState(""); //state to set password
  const [emailError, setEmailError] = useState(""); // state for email error
  const [passwordError, setPasswordError] = useState(""); //state for password error
  const [validate, setValidate] = useState();
  const navigate = useNavigate();

  // function to  handle submit email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isTextValid = true;
    // Running the text validation first
    validateText(password, setPasswordError, setValidate);
    validateText(email, setEmailError, (isValid) => {
      setValidate(isValid);
      isTextValid = isValid;
    });
    // Running  validations if the text validation is successful
    if (isTextValid) {
      validateEmail(email, setEmailError, setValidate);
      validatePassword(password, setPasswordError, setValidate);
    }
    // =================================================================
    // api for backend validation and creadentials checking
    if (validate === true) {
      try {
        const response = await fetch(`${API_URL}/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          // Authentication successful
          const data = await response.json();
          console.log(data);
          localStorage.setItem("authenticated", true);
          navigate("/admin/dashboard");
          // Redirect to the dashboard or perform other actions as needed
        } else {
          // Authentication failed
          const errorData = await response.json();
          console.error(errorData.message);
          localStorage.setItem("authenticated", false);
          setPasswordError("Invalid Credentials");
          // Handle the error and display a message to the user
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    //=================================================================
  };
  // if login is success then we will redirected to admin dashboard
  if (localStorage.getItem("authenticated") === "true") {
    return <AdminDashBoard />;
  }
  //==================================================================
  return (
    <div>
      <div className="container">
        <div className="login-container">
          <h2 className="text-center" id="heading">
            Admin Login
          </h2>
          <form onSubmit={handleSubmit} id="form1">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div id="emailError" className="error my-2">
                {emailError}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div id="passwordError" className="error my-2">
                {passwordError}
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="button" name="/submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
