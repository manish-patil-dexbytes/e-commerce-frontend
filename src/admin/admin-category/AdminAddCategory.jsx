import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useNavigate, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import {
  validateCategoryInput,
  validateDescriptiionInput,
} from "../../helpers/validations";
import ToastComponent from "../components/Toast";
import { getData, postData } from "../../helpers/api/general.Api";
function AddCategory() {
  // State variables for form inputs
  const [category, setCategory] = useState("");
  const [parent, setParent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // State variables for form errors
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [CategoryValidate, setCategoryValidate] = useState("");
  const [DescriptionValidate, setDescriptionValidate] = useState("");

  // State variables for success/error messages and navigation
  const [message, setMessage] = useState("");

  // State variables for dropdown selection and data fetching
  const [data, setData] = useState([]);
  const [showToast, SetShowToast] = useState(false);
  const navigate = useNavigate();
  //===================================================
  // Handle toast close and error message
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Category Already Exist..");
    SetShowToast(true);
  };
  // Function to handle image preview when a file is selected
  const handleImagePreview = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImagePreview(null);
    }
  };
  // Event handlers for input fields
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleParent = (e) => {
    setParent(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  // Function to handle form cancellation
  const handleCancel = () => {
    navigate("/admin/category");
  };
  //=========================================================
  //Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    validateCategoryInput(category, setCategoryError, setCategoryValidate);
    validateDescriptiionInput(
      description,
      setDescriptionError,
      setDescriptionValidate
    );
    if (CategoryValidate === true && DescriptionValidate === true) {
      try {
        const formData = new FormData();
        formData.append("category_name", category);
        formData.append("parent_category", parent);
        formData.append("description", description);
        formData.append("status", 1);
        formData.append("image", image);
        await postData(`/add-category`, formData);
        navigate(-1);
      } catch (error) {
        console.error(error);
        handleErrorToast();
      }
    }
  };
  // Fetch parent category data on component mount
  useEffect(() => {
    getData(`/parent-category`)
      .then((data) => {
        setData(data); // setData is a state updater function
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  }, []);
  return (
    <>
      {showToast && (
        // Toast component for displaying messages
        <div className="toast-css">
          <ToastComponent
            showToast={showToast}
            onClose={handleToastClose}
            message={message}
            delay={3000}
          />
        </div>
      )}
      <div className="container-fluid" style={{ textAlign: "left" }}>
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 bg-light sidebar">
            {/* Sidebar content */}
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>
          {/* Main Content */}
          <main className="col-md-10">
            {/* Top Navbar */}
            <TopNavbar showSearchBar={false} />
            <p className="page-heading">Add Category</p>
            {/* Form section */}
            <div className="form-flex">
              <form method="post" encType="multipart/FormData">
                <div className="row ">
                  <div className="col-md-5">
                    <label htmlFor="category_name">Category Name*</label>
                    {/* Category Name input */}
                    <input
                      type="text"
                      name="category"
                      id="category-form-input-field"
                      className="form-control mb-1 mr-sm-2 "
                      onChange={handleCategory}
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
                      onChange={handleParent}
                    >
                      <option value=""> </option>
                      {data
                        .filter((item) => item.status !== 0)
                        .map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.category_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-10">
                    <label>Description*</label>
                    {/* Description textarea */}
                    <textarea
                      className="form-control mb-1 mr-sm-2"
                      id="category-form-input-field-txtarea"
                      name="description"
                      onChange={handleDescription}
                      placeholder="Description"
                    ></textarea>
                    {descriptionError && (
                      <div className="error-message">{descriptionError}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className=" col-md-3">
                    <label for="image">Image Upload</label>
                    {/* Image upload input */}
                    <input
                      type="file"
                      className="form-control-file"
                      id="image"
                      name="image"
                      onChange={(e) => {
                        handleImage(e);
                        handleImagePreview(e);
                      }}
                    />
                    <div className="col-md-5 images">
                      {/* Image preview */}
                      {imagePreview && (
                        <div className="image-preview">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="preview-image"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="category-button-div">
                  {/* Form buttons */}
                  <button
                    type="submit"
                    className="button-add-cat"
                    onClick={onSubmit}
                  >
                    Submit
                  </button>
                  <button className="button-cancel-cat" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Outlet />
    </>
  );
}
export default AddCategory;
