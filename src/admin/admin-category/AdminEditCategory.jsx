import React, { useState, useEffect } from "react";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import { validateText } from "../../helpers/validations";

export default function EditRecord({
  record,
  onCancel,
  categoryId,
  onSave,
  getCategory,
}) {
  const [editedData, setEditedData] = useState({ ...record });
  const [data, setData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [validate, setValidate] = useState();
  const [categoryError, setCategoryError] = useState(" ");
  const [parent, setParent] = useState(editedData.parent_id);

  useEffect(() => {
    // Make an API request to fetch data
    fetch(`${API_URL}/parent-category`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    if (editedData.parent_category) {
      setParent(editedData.parent_category);
    }
  }, [editedData.parent_category]);
  // function to handle changes in input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  //function to  handle changes in image upload
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImageFile(selectedFile);
  };
  console.log(editedData);
  //function to handle the form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editedData);
    validateText(editedData.category_name, setCategoryError, setValidate);
    if (validate === true) {
      const formData = new FormData();
      formData.append("id", categoryId); // Assuming editedData contains the ID
      formData.append("category_name", editedData.category_name);
      formData.append("parent_category", parent);
      formData.append("status", editedData.status);
      formData.append("description", editedData.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Makes API request to send the form data to your server
      fetch(`${API_URL}/edit-category`, {
        method: "PUT", // Use the correct method for updating data
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          // Handle the API response as needed
          console.log("API Response:", response);
          if (response.success) {
            onSave(editedData);
            getCategory();
          }
        })
        .catch((error) => {
          console.error("Error uploading data:", error);
        });
    }
  };

  const handleParent = (e) => {
    setParent(e.target.value);
  };
  // const handleParent = (e) => {
  //   const selectedParentId = parseInt(e.target.value); // Convert the selected value to an integer
  //   setParent({ ...editedData, parent_id: selectedParentId });
  // };

  return (
    <div className="container-fluid">
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
          <p className="page-heading">Edit data</p>
          <div>
            <div className=" form-flex row">
              <div className="row">
                <div className="col-md-5">
                  <label htmlFor="category_name">Category Name:</label>
                  <input
                    type="text"
                    className="form-control mb-2 mr-sm-2"
                    id="category-form-input-field"
                    name="category_name"
                    value={editedData.category_name}
                    onChange={handleInputChange}
                    placeholder="Category Name"
                  />
                  {categoryError && (
                    <div className="error-message">{categoryError}</div>
                  )}
                </div>

                <div className="col-md-5">
                  <label>Parent Category:</label>
                  <select
                    id="category-form-input-field"
                    name="parent"
                    className="form-control mb-1 mr-sm-2"
                    placeholder="parent"
                    value={editedData.parent_id}
                    onChange={handleParent}
                  >
                    <option value=""> </option>
                    {data.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-10 mt-5  ">
                <label htmlFor="description">Description:</label>
                <textarea
                  className="form-control mb-2 mr-sm-2"
                  id="category-form-input-field-txtarea"
                  name="description"
                  value={editedData.description}
                  onChange={handleInputChange}
                  placeholder="description"
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="image">Image Upload:</label>
                  <br />
                  <br />
                  <input
                    type="file"
                    className="form-control-file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                  />
                  <img
                    src={
                      editedData && editedData.image
                        ? `${API_URL}/category-image-uploades/${editedData.image}`
                        : ""
                    }
                    alt={editedData ? editedData.category_name : ""}
                    className="selected-edit-image"
                  />
                </div>
              </div>

              <div className="row mt-2 col-md-10">
                <div className="col-md-2">
                  <button
                    type="button"
                    className="button-add-cat"
                    onClick={handleSubmit}
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
            </div>
          </div>
        </main>
      </div>
      <Outlet />
    </div>
  );
}
