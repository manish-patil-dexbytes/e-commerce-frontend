import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "../routes";
import React, { useEffect, useState } from "react";
import AdminLogin from "../admin/admin-login/AdminLogin";
import { LoadingAppSvg } from "../admin/components/SVG";
import axios from "axios";

// Component defining the routes for navigation
const RoutesComponent = () => {
  // State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Checking for a valid token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Check if a valid token exists
    if (token) {
      setIsAuthenticated(true);
      // Setting authorization headers for Axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Mapping through the routes and rendering them based on authentication status */}
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              isAuthenticated ? (
                // If authenticated, render the route's component
                <React.Suspense
                  fallback={
                    <div style={{ marginTop: "17%" }}>
                      <LoadingAppSvg />
                    </div>
                  }
                >
                  <route.component />
                </React.Suspense>
              ) : (
                // If not authenticated, render the AdminLogin component
                <AdminLogin />
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
