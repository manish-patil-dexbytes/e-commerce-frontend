import React, { useState, useEffect } from "react";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import axios from "axios";

export default function EditVariant({ record, onCancel, onSave }) {
  const [editedData, setEditedData] = useState({ ...record });
  const [attributes, setAttributes] = useState([]);
 
  

  useEffect(() => {
    if (typeof editedData.attributes === "string") {
      setAttributes(editedData.attributes.split(","));
    }
  }, [editedData]);

  const handleInputChange = (e, index) => {
    const {  value } = e.target;
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
    setEditedData({ ...editedData, attributes: updatedAttributes.join(",") });
  };

const handleAddAttribute = () => {
  const isDuplicate = attributes.some((attribute) => attribute === "");
  if (!isDuplicate) {
    setAttributes([...attributes, ""]);
  }
};

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
    setEditedData({ ...editedData, attributes: updatedAttributes.join(",") });
  };
  const onSubmit = async () => {
    try {
      await axios.put(`${API_URL}/update-variant`, editedData);
      onSave()
    } catch (error) {
      console.error("Error updating variant:", error);
    }
    
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 bg-light sidebar">
          <div className="position-fixed">
            <NavigationBar />
          </div>
        </nav>
        <main className="col-md-10 ">
          <TopNavbar />
          <p className="page-heading">Edit Variant</p>
          <form encType="multipart/FormData" className="col-md-11"></form>
          <div className="row">
            <div className="col-md-4 mb-4">
              <label htmlFor="variantName">Variant Name*</label>
              <input
                id="category-form-input-field"
                type="text"
                name="name"
                className="form-control mb-1 mr-sm-2"
                placeholder="Variant Name"
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row mt-2 col-md-10">
            {attributes.map((attribute, index) => (
              <div
                className="col-md-4 mb-3 d-flex align-items-center"
                key={index}
              >
                <input
                  id={`attribute${index}`}
                  type="text"
                  name={`attribute${index}`}
                  className="form-control mr-2"
                  placeholder="Attribute"
                  value={attribute}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="btn btn-danger"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="row mt-2 col-md-10">
            <div className="col-md-2">
              <button
                type="button"
                className="button-add-cat"
                onClick={handleAddAttribute}
              >
                Add +
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="button-add-cat"
                onClick={onSubmit}
              >
                Save
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="button-cancel-cat"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
      <Outlet />
    </div>
  );
}
