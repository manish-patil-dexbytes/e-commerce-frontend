import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { API_URL } from "../../helpers/config";
import {
  validateImageInput,
  validateCategoryInput,
  validateDescriptiionInput,
} from "../../helpers/validations";
import ToastComponent from "../components/Toast";

function AddCategory() {
  // State variables for form inputs
  const [category, setCategory] = useState("");
  const [parent, setParent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  //=====================================================
  // State variables for form eroors
  const [categoryError, setCategoryError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [imageError, setImageError] = useState("");
  const [CategoryValidate, setCategoryValidate] = useState("");
  const [DescriptionValidate, setDescriptionValidate] = useState("");
  const [ImageValidate, setImageValidate] = useState("");
  // State variables for success/error messages and navigation
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  // State variables for dropdown selection and data fetching
  const [selectedItem, setSelectedItem] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  //===================================================
  const [showToast, SetShowToast] = useState(false);
  //====================================================
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Category Already Exist..");
    SetShowToast(true);
  };
  const handleSucessToast = () => {
    setMessage("Category Added Successfully");
    setMessageColor("success");
  };
  // Function to handle image preview when a file is selected
  //======================================================
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
  const handleCat = (e) => {
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
  // Function to handle form submission
  const handleCance = () => {
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
    validateImageInput(image, setImageError, setImageValidate);
    if (
      CategoryValidate === true &&
      DescriptionValidate === true &&
      ImageValidate === true
    ) {
      var formData = new FormData();
      formData.append("category_name", category);
      formData.append("parent_category", parent);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("image", image);

      try {
        await axios.post(`${API_URL}/add-category`, formData); //API to add category
        navigate("/admin/category");
      } catch (error) {
        console.error(error);
        handleErrorToast();
      }
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/parent-category`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSelectChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <>
      {showToast && (
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
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>
          <main className="col-md-10">
            <TopNavbar />
            <p className="page-heading">Add Data</p>
            <div className="form-flex">
              <form method="post" encType="multipart/FormData">
                <div className="row m-3">
                  <div className="col-md-5">
                    <label htmlFor="category_name">Category Name*</label>
                    <input
                      type="text"
                      name="category"
                      id="category-form-input-field"
                      className="form-control mb-1 mr-sm-2 "
                      onChange={handleCat}
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
                <div className="row m-3">
                  <div className="col-md-10">
                    <label>Description*</label>
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
                <div className="row mt-3" style={{ marginLeft: "19px" }}>
                  <div className=" col-md-3">
                    <label for="image">Image Upload*</label>
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
                    {imageError && (
                      <div className="error-message">{imageError}</div>
                    )}
                    <div className="col-md-5 images">
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
                  <button
                    type="submit"
                    className="button-add-cat"
                    onClick={onSubmit}
                  >
                    Submit
                  </button>
                  <button className="button-cancel-cat" onClick={handleCance}>
                    Cancel
                  </button>
                </div>
              </form>
              {message && (
                <p className={`message ${messageColor}`}>{message}</p>
              )}
            </div>
          </main>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default AddCategory;
