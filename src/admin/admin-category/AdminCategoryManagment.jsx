import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import EditRecord from "./AdminEditCategory";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { API_URL } from "../../helpers/config";
import ToastComponent from "../components/Toast";
import { viewSvg, EditSvg, ViewSvg } from "../components/SVG";

export default function AdminCatMangment() {
  const [category, setCategory] = useState([]); // State for  category name
  const [selectedRecord, setSelectedRecord] = useState(null); // State for  selected record  name
  const [isEditing, setIsEditing] = useState(false); // State for  enbling or disabling editing
  const [showViewModal, setShowViewModal] = useState(false); // State for   view model
  const [viewCategory, setViewCategory] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for showing the toast
  const [toastMessage, setToastMessage] = useState("");
  //====================================================
  //Toast for showing the messages
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Close the toast after 3 seconds
  };

  //========================================================
  const getCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-categories`);
      setCategory(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategory();
    // showToastMessage();
    // showToastMessage("Category added successfully!");
  }, []);
  //parsing data to data table
  const columns = [
    {
      name: "Category",
      selector: (row) =>
        row.category_name.charAt(0).toUpperCase() + row.category_name.slice(1),
    },
    {
      name: "Parent Category",
      selector: (row) => {
        if (row.parent_category) {
          return (
            row.parent_category.charAt(0).toUpperCase() +
            row.parent_category.slice(1)
          );
        } else {
          return "";
        }
      },
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() => handleStatusChange(row)}
          className={`button-style ${
            row.status === 1 ? "active-status" : "inactive-status"
          }`}
        >
          {row.status === 1 ? "Active" : "Inactive"}
        </button>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => {
              getCategory();
              handleView(row);
            }}
            style={{ border: "none" }}
          >
            <ViewSvg />
          </button>
          <button onClick={() => handleEdit(row)} className="handle-edit">
            <EditSvg />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    setSelectedRecord(row);
    setIsEditing(true);
    setSelectedId(row.id);
  };
  const handleSaveEdit = async () => {
    try {
      await getCategory();
      showToastMessage("Category updated successfully!");
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
  };

  const handleView = (row) => {
    setSelectedId(row.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  useEffect(() => {
    if (showViewModal) {
      viewCategoryData(selectedId);
    }
  }, [showViewModal]);

  const viewCategoryData = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/view-categories/${id}`);
      setViewCategory(response.data);
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  //============================

  const handleStatusChange = async (row) => {
    const updatedStatus = row.status === 1 ? 0 : 1; // Toggle status between 0 and 1
    try {
      // Ensure you send a non-null value for category_name
      const response = await axios.put(
        `${API_URL}/categories-status/status/${row.id}`,
        {
          status: updatedStatus,
        }
      );
      // Check the response before calling getCategory
      if (
        response.data &&
        response.data.message === "Record updated successfully"
      ) {
        getCategory();
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };
  const handleToastClose = () => setShowToast(false);
  console.log(selectedRecord);

  return (
    <>
      {showToast && (
        <div className="toast-css">
          <ToastComponent
            showToast={showToast}
            onClose={handleToastClose}
            message={toastMessage}
            messageType="success"
            delay={3000}
          />
        </div>
      )}
      {showViewModal && selectedId && (
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Category Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={6}>
                <img
                  src={
                    viewCategory && viewCategory.image
                      ? `${API_URL}/category-image-uploades/${viewCategory.image}`
                      : ""
                  }
                  alt={viewCategory ? viewCategory.category_name : ""}
                  className="view-modal-img"
                />
              </Col>
              <Col sm={6}>
                <p>
                  Category Name:{" "}
                  {viewCategory
                    ? viewCategory.category_name.charAt(0).toUpperCase() +
                      viewCategory.category_name.slice(1)
                    : ""}
                </p>
                <p>
                  Parent Category:{" "}
                  {viewCategory && viewCategory.parent_name
                    ? viewCategory.parent_name.charAt(0).toUpperCase() +
                      viewCategory.parent_name.slice(1)
                    : ""}
                </p>

                {viewCategory && viewCategory.description && (
                  <p>
                    Description:{" "}
                    {viewCategory.description.charAt(0).toUpperCase() +
                      viewCategory.description.slice(1)}
                  </p>
                )}

                {(!viewCategory || !viewCategory.description) && (
                  <p>Description: No Description</p>
                )}
                <p>
                  Status:{" "}
                  <span
                    style={{
                      color:
                        viewCategory && viewCategory.status === 1
                          ? "green"
                          : "red",
                    }}
                  >
                    {viewCategory && viewCategory.status === 1
                      ? "Active"
                      : "Inactive"}
                  </span>
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isEditing && selectedRecord && (
        <div className="edit-record-container">
          <EditRecord
            record={selectedRecord}
            onSave={() => {
              handleSaveEdit();
            }}
            onCancel={() => {
              setSelectedRecord(null);
              setIsEditing(false);
            }}
            categoryId={selectedId}
          />
        </div>
      )}
      {isEditing || (
        <div className="container-fluid" style={{ textAlign: "left" }}>
          <div className="row">
            {/* Sidebar */}
            <nav className="col-md-2 bg-light sidebar">
              <div className="position-fixed">
                <NavigationBar />
              </div>
            </nav>

            {/* Main Content */}
            <main className="col-md-10 ">
              <TopNavbar />
              <p className="page-heading">Category</p>
              <div className="col-md-11 table-css">
                <Link to="/admin/category/add-category">
                  <Button
                    style={{
                      color: "black",
                      backgroundColor: "#ea7c0f",
                      borderColor: "#e3974b",
                      transition: "background-color 0.1s",
                    }}
                    className="mt-2 mb-2 add-btn "
                  >
                    Add
                  </Button>
                </Link>
                <div className="custom-table">
                  <DataTable
                    columns={columns}
                    data={category}
                    pagination
                    paginationPerPage={9}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}
