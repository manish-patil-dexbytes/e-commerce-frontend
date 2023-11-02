import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";

import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";

//============================================
export default function ProductVarient() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>

          <main className="col-md-10 " style={{ textAlign: "left" }}>
            <TopNavbar />

            <p className="page-heading">Varients</p>
            <div className="col-md-11 table-css">
              <Link to="/admin/varients/add">
                <Button
                  style={{
                    color: "black",
                    backgroundColor: "#ea7c0f",
                    borderColor: "#e3974b",
                    transition: "background-color 0.1s",
                  }}
                  className="mt-2 mb-2 add-btn"
                >
                  Add
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </div>

      <Outlet />
    </>
  );
}
