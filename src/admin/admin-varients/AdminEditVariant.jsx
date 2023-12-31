import React, { useState, useEffect } from "react";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { updateData } from "../../helpers/api/general.Api";

export default function EditVariant({ record, onCancel, onSave }) {
  // State for edited data and attributes
  const [editedData, setEditedData] = useState({ ...record });
  const [attributes, setAttributes] = useState([]);
  // Update attributes when edited data changes
  useEffect(() => {
    if (typeof editedData.attributes === "string") {
      setAttributes(editedData.attributes.split(","));
    }
  }, [editedData]);
  // Handle input change for individual attributes
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
    setEditedData({ ...editedData, attributes: updatedAttributes.join(",") });
  };
  // Add an empty attribute field
  const handleAddAttribute = () => {
    const isDuplicate = attributes.some((attribute) => attribute === "");
    if (!isDuplicate) {
      setAttributes([...attributes, ""]);
    }
  };
  // Remove an attribute field
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
    setEditedData({ ...editedData, attributes: updatedAttributes.join(",") });
  };
  // Clean and validate attributes before submission
  const cleanAttributes = attributes
    .map((attribute) => attribute.replace(/\s+/g, "").trim().toLowerCase())
    .filter((attribute) => attribute !== "" && attribute !== null);

  const onSubmit = async () => {
    const uniqueAttributes = [...new Set(cleanAttributes)]; // Remove duplicates

    try {
      await updateData(`/update-variant`, {
        ...editedData,
        attributes: uniqueAttributes.join(","), // Set cleaned attributes
      });
      onSave(); // Call the onSave function passed from the parent component
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  };
  // Return statement for EditVariant component
  return (
    <>
      {/* Structure for displaying the form and inputs */}
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              {/* side navigation bar  */}
              <NavigationBar />
            </div>
          </nav>
          <main className="col-md-10 ">
            {/* top navigation bar  */}
            <TopNavbar showSearchBar={false} />
            <p className="page-heading">Edit Variant</p>
            <form encType="multipart/FormData" className="col-md-11"></form>
            {/* Form content */}
            <div className="row">
              {/* Input field for Variant Name */}
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
              {/* Attribute fields */}
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
                  {/* Button to remove an attribute */}
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
            <div className="row mt-2 col-md-10" style={{ marginLeft: "-39px" }}>
              {/* Buttons for adding, saving, and canceling */}
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
    </>
  );
}
