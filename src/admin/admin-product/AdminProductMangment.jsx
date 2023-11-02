import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { API_URL } from "../../helpers/config";
import EditProduct from "./AdminEditProduct";
import "../../styles/Admin.css";
import { DeleteSvg, EditSvg } from "../components/SVG";
import ToastComponent from "../components/Toast";

export default function ProductManagment() {
  const [product, setProduct] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showToast, SetShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const getProduct = async (filter = "") => {
    try {
      const response = await axios.get(`${API_URL}/get-products`);
      const filteredData = response.data.filter((item) =>
        item.product_name.toLowerCase().includes(filter.toLowerCase())
      );
      setProduct(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    getProduct();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteProduct/${id}`);
      if (response.data.success) {
        getProduct(); // to update the list after deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  //==================================================

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);
  //==========================================================

  const handleCategoryFilter = async (categoryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-products?category_id=${categoryId}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  //===================================================
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Product Edited Successfully");
    SetShowToast(true);
  };
  //=================================================
  const columns = [
    {
      name: "Product Name",
      selector: (row) =>
        row.product_name.charAt(0).toUpperCase() + row.product_name.slice(1),
    },
    {
      name: "Category Name",
      selector: (row) =>
        row.category_name.charAt(0).toUpperCase() + row.category_name.slice(1),
    },

    {
      name: "Quantity",
      selector: (row) => (row.quantity ? row.quantity : ""),
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
            <EditSvg />
          </button>
          <div style={{ display: "inline-block", position: "relative" }}>
            <input
              type="checkbox"
              id={`toggle-${index}`}
              className="toggle-input"
              style={{ display: "none" }}
              // checked={row.status === 1}
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
            <DeleteSvg />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditing(true);
    setSelectedId(record.product_id);
  };
  const handleSaveEdit = async () => {
    try {
      await getProduct();
      handleErrorToast();
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
  };
  //======================================
  const handleStatusChange = async (row) => {
    const updatedStatus = row.status === 1 ? 0 : 1; // Toggle status between 0 and 1
    try {
      const response = await axios.put(
        `${API_URL}/product-status/status/${row.product_id}`,
        {
          status: updatedStatus,
        }
      );
      // Check the response before calling getProduct
      if (
        response.data &&
        response.data.message === "Record updated successfully"
      ) {
        await getProduct();
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };
  //======================================
  return (
    <>
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
          <EditProduct
            record={selectedRecord}
            onSave={handleSaveEdit} // Removed unnecessary braces
            onCancel={() => {
              setSelectedRecord(null); // Updated state variable correctly
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
                  {product.length > 0 && (
                    <DataTable
                      columns={columns}
                      data={product}
                      pagination
                      paginationPerPage={9}
                      sortIcon={<span>&nbsp;&#x21c5;</span>}
                    />
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
