import React, { useState, useEffect } from "react";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import { validateText } from "../../helpers/validations";
import ToastComponent from "../components/Toast";
import { getData, updateData } from "../../helpers/api/general.Api";

export default function EditRecord({
  record,
  onCancel,
  categoryId,
  onSave,
  getCategory,
}) {
  // State declarations
  const [editedData, setEditedData] = useState({ ...record });
  const [data, setData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [validate, setValidate] = useState();
  const [categoryError, setCategoryError] = useState(" ");
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [showToast, SetShowToast] = useState(false);
  const handleToastClose = () => SetShowToast(false);
  // useEffect to fetch parent category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(`/parent-category`);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [editedData.parent_category]);

  // function to handle changes in input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  //function to  handle changes in image upload
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setSelectedImage(URL.createObjectURL(selectedFile));
    setImageFile(selectedFile);
  };
  // Function to handle changes in parent category selection
  const handleParent = (e) => {
    const selectedParentId = e.target.value;
    setEditedData({ ...editedData, parent_id: selectedParentId });
  };
  //
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateText(editedData.category_name, setCategoryError, setValidate);
    if (validate === true) {
      const formData = new FormData();
      formData.append("id", categoryId);
      formData.append("category_name", editedData.category_name);
      formData.append("parent_category", editedData.parent_id);
      formData.append("status", editedData.status);
      formData.append("description", editedData.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        const response = await updateData(`${API_URL}/edit-category`, formData);
        if (response.success) {
          onSave(editedData);
          getCategory();
          setMessage("Data updated successfully");
          SetShowToast(true);
        } else {
          setMessage(response.message);
          SetShowToast(true);
        }
      } catch (error) {
        console.error("Error uploading data:", error);
        setMessage("Failed to update data");
        SetShowToast(true);
      }
    }
  };
  return (
    <>
      {/* Toast component for displaying messages */}
      {showToast && (
        <div className="toast-css">
          <ToastComponent
            showToast={true}
            onClose={handleToastClose}
            message={message}
            delay={3000}
          />
        </div>
      )}
      {/* Main container */}
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
            {/* Top Navbar */}
            <TopNavbar showSearchBar={false} />
            <p className="page-heading">Edit data</p>
            <div>
              {/* Form for editing data */}
              <div className=" form-flex row">
                <div className="row">
                  <div className="col-md-5">
                    <label htmlFor="category_name">Category Name:</label>
                    {/* Category Name input */}
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
                    {/* Parent Category select */}
                    <select
                      id="category-form-input-field"
                      name="parent"
                      className="form-control mb-1 mr-sm-2"
                      placeholder="parent"
                      value={editedData.parent_id}
                      onChange={handleParent}
                    >
                      <option value=""> </option>
                      {data
                        .filter((item) => item.id !== categoryId) // Exclude the current category from the list
                        .map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.parent_name
                              ? item.parent_name
                              : item.category_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-10 mt-5  ">
                  <label htmlFor="description">Description:</label>
                  {/* Description textarea */}
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
                    {/* Image Upload input */}
                    <input
                      type="file"
                      className="form-control-file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                    />
                    {/* Display selected image or existing image */}
                    <img
                      src={
                        selectedImage
                          ? selectedImage
                          : editedData && editedData.image
                          ? `${API_URL}/category-image-uploades/${editedData.image}`
                          : "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      }
                      alt={editedData ? editedData.category_name : ""}
                      className="selected-edit-image"
                    />
                  </div>
                </div>

                <div
                  className="row mt-2 col-md-10 "
                  style={{ marginLeft: "-45px" }}
                >
                  <div className="col-md-2">
                    {/* Save and Cancel buttons */}
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
    </>
  );
}
