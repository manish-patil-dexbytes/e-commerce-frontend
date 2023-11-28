import NavigationBar from "../components/AdminSideNavBar";
import React from "react";
import "../../styles/Admin.css";
import BarGraph from "../components/AdminDahBoardGraph";
import TopNavbar from "../components/AdminTopNavBar";
import { Outlet } from "react-router-dom";

export default function AdminDashBoard() {
  return (
    <div className="container-fluid ">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-2 bg-light sidebar">
          <div className="position-sticky">
            {/* Sidebar content */}
            <NavigationBar />
          </div>
        </nav>
        {/* Main Content */}
        <main className="col-md-9 ">
          {/* Top navigation bar */}
          <TopNavbar />
          {/* Dashboard label */}
          <div className="label"> Dashboard</div>
          {/* Dashboard metrics */}
          <div className="row">
            {/* Active Customers */}
            <div className="col-md-2 bor">
              <p className="Text"> Active Customers</p>
            </div>
            {/* Total Orders */}
            <div className="col-md-2 bor">
              <p className="Text"> Total Orders</p>
            </div>
            {/* Active Orders */}
            <div className="col-md-2 bor">
              <p className="Text"> Active Orders</p>
            </div>
            {/* Completed Orders */}
            <div className="col-md-2 bor">
              <p className="Text"> Completed Orders</p>
            </div>
            {/* Canceled Orders */}
            <div className="col-md-2 bor">
              <p className="Text">Canceled Orders</p>
            </div>
            <div className="margin-topGraph">
              {/* Bar Graph */}
              <BarGraph />
            </div>
          </div>
        </main>
      </div>
      <Outlet />
    </div>
  );
}
