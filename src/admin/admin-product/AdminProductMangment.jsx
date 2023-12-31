import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { API_URL } from "../../helpers/config";
import EditProduct from "./AdminEditProduct";
import "../../styles/Admin.css";
import { DeleteSvg, EditSvg } from "../components/SVG";
import ToastComponent from "../components/Toast";
import { updateProductStatus } from "../../helpers/api/product.Api";
import { deleteData, getData } from "../../helpers/api/general.Api";

export default function ProductManagment() {
  // State declarations
  const [product, setProduct] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showToast, SetShowToast] = useState(false);
  const [message, setMessage] = useState("");
  // Function to fetch products
  const getProduct = async (filter = "") => {
    // Fetching products based on a filter
    try {
      const data = await getData(`${API_URL}/get-products`);
      const filteredData = data.filter(
        (item) =>
          item.product_name.toLowerCase().includes(filter.toLowerCase()) ||
          (item.category_name &&
            item.category_name.toLowerCase().includes(filter.toLowerCase()))
      );
      setProduct(filteredData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // Fetch products on component mount
    getProduct();
  }, []);
  // Function to delete a product
  const handleDeleteProduct = async (id) => {
    // Deleting a product by ID
    try {
      const success = await deleteData(`/deleteProduct/${id}`);
      if (success) {
        const updatedProduct = product.filter((item) => item.product_id !== id);
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // Function to handle status change of a product
  const handleStatusChange = async (row) => {
    const updatedStatus = row.status === 1 ? 0 : 1; // Changing status (toggle between 0 and 1)
    try {
      const success = await updateProductStatus(row.product_id, updatedStatus);
      if (success) {
        const updatedProduct = product.map((item) =>
          item.product_id === row.product_id
            ? { ...item, status: updatedStatus }
            : item
        );
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };
  // Function to handle closing toast
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Product Edited Successfully");
    SetShowToast(true);
  };
  // Column configuration for DataTable
  const columns = [
    {
      name: "Product Name",
      selector: (row) =>
        row.product_name.charAt(0).toUpperCase() + row.product_name.slice(1), // display product name starting with capital letter
    },
    {
      name: "Category Name",
      selector: (row) =>
        row.category_name.charAt(0).toUpperCase() + row.category_name.slice(1), //display category name with capital letter
    },

    {
      name: "Quantity",
      selector: (row) => (row.quantity ? row.quantity : ""), //quantity
      sortable: true,
    },
    { name: "Price/Unit", selector: (row) => row.price, sortable: true },
    {
      name: "Status",
      selector: (row) => (row.status === 1 ? "Published" : "Unpublished"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div key={index}>
          <button onClick={() => handleEdit(row)} className="handle-edit">
            {/* svg for edit icon  */}
            <EditSvg />
          </button>
          <div style={{ display: "inline-block", position: "relative" }}>
            <input
              type="checkbox"
              id={`toggle-${index}`}
              className="toggle-input"
              style={{ display: "none" }}
              checked={row.status === 1}
              onChange={() => {
                getProduct();
                handleStatusChange(row);
              }}
            />
            <label
              htmlFor={`toggle-${index}`}
              className="toggle-label"
              id="toggle-position-product"
              style={{ borderRadius: "20px", top: -13, marginLeft: "-7px" }}
            />
          </div>
          <button
            style={{ marginLeft: "40px", border: "none" }}
            onClick={() => handleDeleteProduct(row.product_id)}
          >
            {/* dvg fot delete icon  */}
            <DeleteSvg />
          </button>
        </div>
      ),
    },
  ];
  // Function to handle editing a record
  const handleEdit = (record) => {
    // Setting the selected record for editing
    setSelectedRecord(record);
    setIsEditing(true);
    setSelectedId(record.product_id);
  };
  // Function to handle saving edits
  const handleSaveEdit = async () => {
    try {
      await getProduct();
      handleErrorToast();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };
  // Return statement for ProductManagement component
  //======================================
  return (
    <>
      {/* Toast component to display success message */}
      {showToast && (
        <div className="toast-css">
          <ToastComponent
            showToast={showToast}
            onClose={handleToastClose}
            message={message}
            delay={3000}
            messageType="success"
          />
        </div>
      )}
      {isEditing && selectedRecord && (
        <div className="edit-record-container">
          {/* Edit product section */}
          <EditProduct
            record={selectedRecord}
            onSave={handleSaveEdit}
            onCancel={() => {
              setSelectedRecord(null);
              setIsEditing(false);
            }}
            categoryId={selectedId}
          />
        </div>
      )}
      {isEditing || (
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 bg-light sidebar">
              <div className="position-fixed">
                <NavigationBar />
              </div>
            </nav>
            <main className="col-md-10 " style={{ textAlign: "left" }}>
              <TopNavbar handleFilter={getProduct} />

              <p className="page-heading">Product</p>
              {/* Product Management section */}
              <div className="col-md-11 table-css">
                <Link to="/admin/product/add">
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
                <div className="custom-table">
                  {product.length > 0 ? (
                    //  data tabble for product
                    <DataTable
                      columns={columns}
                      data={product}
                      pagination
                      paginationPerPage={9}
                      sortIcon={<span>&nbsp;&#x21c5;</span>}
                    />
                  ) : (
                    <div>No products found.</div>
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
