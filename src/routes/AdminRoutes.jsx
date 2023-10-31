import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from "../routes";
import React from 'react';
import AdminLogin from '../admin/admin-login/AdminLogin';
import { LoadingAppSvg } from '../admin/components/SVG';

const RoutesComponent = () => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
// if user is not logged in then return this 
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<AdminLogin />}
            />
          ))}
        </Routes>
      </Router>
    );
  }
//if user is logged in then return this
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <React.Suspense fallback={<div style={{marginTop:"17%"}}><LoadingAppSvg/></div>}>
                <route.component />
              </React.Suspense>
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default RoutesComponent;


