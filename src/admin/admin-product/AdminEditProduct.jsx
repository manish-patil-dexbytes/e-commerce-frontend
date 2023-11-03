import React, { useState, useEffect } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function EditProduct({ record, onCancel, onSave }) {
  const [editedData, setEditedData] = useState({ ...record });
  const [data, setData] = useState([]);
  const [dbDate, setDbdate] = useState();

  const [categoryError, setCategoryError] = useState(" ");
  const [launchDate, setLaunchDate] = useState(dbDate);
  const [selectedImages, setSelectedImages] = useState([]); // set selected images in array
  const [productError, setProductError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [QuantityError, setQuantityError] = useState("");
  const [SKUError, setSKUError] = useState("");
  const [category, setCategory] = useState(editedData.category_id);
  const [treeData, setTreeData] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  //==========================
  const convertToDate = () => {
    const dateParts = record.lauch_date.split("/");
    const validDate = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    setDbdate(validDate);
  };

  //======================
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.value;
    const selectedCategory = data.find(
      (item) => item.id === selectedCategoryId
    );
    setEditedData({
      ...editedData,
      category_id: selectedCategoryId,
      category: selectedCategory,
    });
  };
  //==========================
  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    const selectedSubCategory = data.find(
      (item) => item.id === selectedSubCategoryId
    );
    setEditedData({
      ...editedData,
      sub_category_id: selectedSubCategoryId,
      sub_category: selectedSubCategory,
    });
  };

  const onSelectFile = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files);
    setSelectedImages(selectedImages);
  };
  const handleDateChange = (selectedDate) => {
    setLaunchDate(selectedDate);
    setDbdate(selectedDate); // Update the dbDate with the selected date
  };

  //function to handle image preview
  const previewImage = (image) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "100%"; // Adjust the width as per your requirement
    };
    reader.readAsDataURL(image); //creating an URL for image src in preview div
  };

  //function to remove selected image
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(
      updatedImages.map((image, idx) => ({
        ...image,
        index: idx, // shift the indexes after deletion
      }))
    );
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("id", editedData.product_id);
    formData.append("product_name", editedData.product_name);
    formData.append("category_id", editedData.category_id);
    formData.append("price", editedData.price);
    formData.append("discounted_price", editedData.discounted_price);
    formData.append("quantity", editedData.quantity);
    formData.append("SKU", editedData.sku);
    formData.append("launch_date", launchDate);
    formData.append("description", editedData.description);

    // Append each selected image individually
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("media", selectedImages[i]); // Append each image individually
    }

    try {
      const response = await axios.put(`${API_URL}/edit-product`, formData);
      onSave();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log(selectedImages);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data;
        const formattedData = buildTree(data);
        setTreeData(formattedData);
        convertToDate();
      } catch (error) {
        console.error("Error fetching data from the server:", error);
      }
    };
    fetchData();
  }, []);
  console.log(typeof editedData.images);
  //=============================================
  //function to tree structure of category and sub category
  const buildTree = (categories, parent_id = null) => {
    let tree = [];
    let subTree = [];

    categories
      .filter((category) => category.parent_id === parent_id)
      .forEach((category) => {
        let children = buildTree(categories, category.category_id);
        let node = {
          label: category.category_name,
          value: category.category_id,
        };
        if (children.length) {
          node.children = children;
        }
        if (parent_id === null) {
          tree.push(node); // Push to main category tree
        } else {
          subTree.push(node); // Push to subcategory tree
        }
      });

    if (parent_id === null) {
      return tree; // Return the main category tree
    } else {
      return subTree; // Return the subcategory tree
    }
  };

  //============================================
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
          <p className="page-heading">Edit Product</p>
          <form encType="multipart/FormData" className="col-md-11">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="product_name">Product Name</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="product_name"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.product_name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                />
                {productError && (
                  <div className="error-message">{productError}</div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                <label>Category</label>
                <div className="mb-1 mr-sm-2" id="category-form-input-field">
                  <DropdownTreeSelect
                    data={treeData}
                    onChange={handleCategoryChange}
                    className="mdl-demo"
                  />
                </div>

                {categoryError && (
                  <div className="error-message">{categoryError}</div>
                )}
              </div>

              <div className="col-md-4">
                <label htmlFor="price">Price Per Unit</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="price"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.price}
                  onChange={handleInputChange}
                  placeholder=" Product Price"
                />
                {priceError && (
                  <div className="error-message">{priceError}</div>
                )}
              </div>
              <div className="col-md-4">
                <label htmlFor="price">Discounted Price</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="discountedprice"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.discounted_price}
                  onChange={handleInputChange}
                  placeholder=" Discounted Price"
                />
                {discountError && (
                  <div className="error-message">{discountError}</div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                <label htmlFor="price">Quantity</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="quantity"
                  value={editedData.quantity}
                  className="form-control mb-1 mr-sm-2"
                  placeholder="Enter Product Quantity"
                  onChange={handleInputChange}
                />
                {QuantityError && (
                  <div className="error-message">{QuantityError}</div>
                )}
              </div>
              <div className="col-md-4">
                <label htmlFor="sub-category">SKU</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="sku"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.sku}
                  placeholder="Enter SKU "
                  onChange={handleInputChange}
                />
                {SKUError && <div className="error-message">{SKUError}</div>}
              </div>
              <div className="col-md-4">
                <label htmlFor="price">Launch Date</label>
                <div
                  id="category-form-input-field"
                  className="form-control mb-1 mr-sm-2"
                >
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholder={editedData.launch_date}
                    selected={dbDate}
                    onChange={handleDateChange}
                    className="date"
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div>
                <label>Description:</label>
                <textarea
                  id="category-form-input-field-txtarea"
                  className="form-control mb-1 mr-sm-2"
                  name="description"
                  placeholder="Description"
                  value={editedData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="row mt-3 mb-5">
              <div className="col-md-3">
                <label for="image">Upload Media</label>
                <input
                  type="file"
                  name="image"
                  multiple
                  onChange={onSelectFile}
                />
              </div>
              <div className="col-md-4 images" style={{ display: "flex" }}>
                {/* {selectedImages &&
                  selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="image-wrapper"
                      id="image-preview-product"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={() => previewImage(image)}
                    >
                      <button
                        className="remove-button"
                        id="image-preview-product-btn"
                        onClick={() => removeImage(index)}
                      >
                        X
                      </button>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index}`}
                        id="selected-product-img"
                      />
                    </div>
                  ))}
                {  editedData && editedData.images ? (
                  editedData.images
                    .split(",")
                    .map((imageName, index) => (
                      <img
                        key={index}
                        src={`${API_URL}/product-image-uploads/${imageName.trim()}`}
                        alt={editedData.category_name || ""}
                        className="selected-edit-image"
                      />
                    ))
                ) : (
                  <p>No images found</p>
                )} */}
                {selectedImages && selectedImages.length > 0 ? (
                  selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="image-wrapper"
                      id="image-preview-product"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={() => previewImage(image)}
                    >
                      <button
                        className="remove-button"
                        id="image-preview-product-btn"
                        onClick={() => removeImage(index)}
                      >
                        X
                      </button>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index}`}
                        id="selected-product-img"
                      />
                    </div>
                  ))
                ) : editedData && editedData.images ? (
                  editedData.images
                    .split(",")
                    .map((imageName, index) => (
                      <img
                        key={index}
                        src={`${API_URL}/product-image-uploads/${imageName.trim()}`}
                        alt={editedData.category_name || ""}
                        className="selected-edit-image"
                        style={{
                          marginLeft: "10px",
                          border: "1px solid black",
                        }}
                      />
                    ))
                ) : (
                  <p>No images found</p>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div id="produc-submit-cancel-btn">
                <button
                  type="submit"
                  className="button-add-cat"
                  onClick={onSubmit}
                >
                  Submit
                </button>
                <button className="button-cancel-cat" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Outlet />
    </div>
  );
}
