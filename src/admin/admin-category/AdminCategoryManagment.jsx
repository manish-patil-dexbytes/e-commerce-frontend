import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import EditRecord from "./AdminEditCategory";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { API_URL } from "../../helpers/config";
import ToastComponent from "../components/Toast";
import { EditSvg, ViewSvg } from "../components/SVG";
import { updateCategoryStatus } from "../../helpers/api/category.Api";
import { getData } from "../../helpers/api/general.Api";

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
  //function to get category data
  const getCategory = async (filter = "") => {
    try {
      const response = await getData(`/get-categories`);
      const filteredData = response.filter((item) =>
        item.category_name.toLowerCase().includes(filter.toLowerCase())
      );
      setCategory(filteredData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategory(); // Fetch all categories initially
  }, []);
  // function to view data for specific id
  const viewCategoryData = async (id) => {
    try {
      const data = await getData(`/view-categories/${id}`);
      setViewCategory(data); // Assuming setViewCategory is a state updater function
    } catch (error) {
      console.error("API request error:", error);
    }
  };
  //function to  handle status change
  const handleStatusChange = async (row) => {
    const updatedStatus = row.status === 1 ? 0 : 1;
    try {
      const isUpdated = await updateCategoryStatus(row.id, updatedStatus);
      if (isUpdated) {
        const updatedCategory = category.map((item) =>
          item.id === row.id ? { ...item, status: updatedStatus } : item
        );
        setCategory(updatedCategory);
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };
  useEffect(() => {
    if (showViewModal && selectedId) {
      viewCategoryData(selectedId);
    }
  }, [showViewModal]);
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
  //functiong for  showing and hiding the toast messages
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Close the toast after 3 seconds
  };
  const handleToastClose = () => setShowToast(false);
  //function to handle edit data of category
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
  //function to handle view data of specific category
  const handleView = (row) => {
    setSelectedId(row.id);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };
  //======================================================
  return (
    <>
      {showToast && (
        // Toast component to display a success message
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
        // Modal to display category details
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Category Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Displaying category details */}
            <Row>
              <Col sm={6}>
                {/* Display category image */}
                <img
                  src={
                    viewCategory && viewCategory.image
                      ? `${API_URL}/category-image-uploades/${viewCategory.image}`
                      : "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                  }
                  alt={viewCategory ? viewCategory.category_name : ""}
                  className="view-modal-img"
                />
              </Col>
              <Col sm={6}>
                {/* Display category information */}
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
          {/* Modal Footer */}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isEditing && selectedRecord && (
        // Editing a record
        <div className="edit-record-container">
          {/* EditRecord component */}
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
        // Displaying content if not editing
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
              <TopNavbar handleFilter={getCategory} />
              {/* Top navigation bar */}
              <p className="page-heading">Category</p>
              {/* Displaying category table */}
              <div className="col-md-11 table-css">
                {/* Link to add category */}
                <Link to="/admin/category/add-category">
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
                {/* Displaying table data */}
                <div className="custom-table">
                   {category.length > 0 ? (
                  <div>
                    <DataTable columns={columns} data={category} />
                  </div>
                ) : (
                  <div>No category Found</div>
                )}
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
