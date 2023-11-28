import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from "../routes";
import React, { useEffect, useState } from 'react';
import AdminLogin from '../admin/admin-login/AdminLogin';
import { LoadingAppSvg } from '../admin/components/SVG';
import axios from 'axios';

const RoutesComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Check if a valid token exists
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              isAuthenticated ? (
                <React.Suspense fallback={<div style={{marginTop:"17%"}}><LoadingAppSvg/></div>}>
                  <route.component />
                </React.Suspense>
              ) : (
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
