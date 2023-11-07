
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../../styles/Admin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, Link, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { API_URL } from "../../helpers/config";
import ProductPreview from "./AdminPreviewProduct";

import {
  validateText,
  validateNumber,
  validatPriceDiscount,
  validateQuantityNotLessThanZero,
  validateAlphaNumeric,
  ValidateMedia
  
} from "../../helpers/validations";
import ToastComponent from "../components/Toast";
export default function AddProduct() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState(""); //state to pass category  name to preview model
  const [showProductPreview, setShowProductPreview] = useState(false); //state the set preview
  const [launchDate, setLaunchDate] = useState(new Date()); // or any default date in the format "DD/MM/YYYY"
  const [product_name, setProduct] = useState(""); //product name
  const [price, setPrice] = useState(""); //set price
  const [quantity, setQuantity] = useState(""); //set quantity
  const [description, setDescription] = useState(""); //set description
  const [discount, setDiscount] = useState(""); //set discount
  const [sku, setSKU] = useState(""); //set sku
  const [selectedImages, setSelectedImages] = useState([]); // set selected images in array
  const [published, setPublished] = useState(1); //staus
  
  //=====================================================
  const [selectedVideos, setSelectedVideos] = useState([]);
  const mediaFiles = [...selectedImages, ...selectedVideos];
  //=====================================================
  //validations states
  const [productError, setProductError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [QuantityError, setQuantityError] = useState("");
  const [SKUError, setSKUError] = useState("");
  const[mediaError,setMediaError]=useState("");
  const [showToast, SetShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [treeData, setTreeData] = useState([]);
  const[validateProduct,setValidateProduct]=useState(false)
  const [validateSku, setValidateSku] = useState(false);
  const[validatePrice,setValidatePrice]=useState(false);
  const[validateDiscount,setValidateDiscount]=useState(false);
  const[validateQuantity,setValidateQuantity]=useState(false);
  const[validateCategory,setValidateCategory ] = useState(false)
  const[validateMedia,setValidateMedia] = useState(false);
  const navigate = useNavigate();
  //=======================================================
  // all the api handles
  // API to get all the category and sub category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data;
        const formattedData = buildTree(data);
        setTreeData(formattedData);
      } catch (error) {
        console.error("Error fetching data from the server:", error);
      }
    };
    fetchData();
  }, []);
  //fnction uto handle the form data
  const onSubmit = async (e) => {
    e.preventDefault();
    validateText(product_name, setProductError, setValidateProduct);
    validateText(selectedCategory,setCategoryError,setValidateCategory);
    validateAlphaNumeric(sku, setSKUError, setValidateSku);
    validateText(price, setPriceError, setValidatePrice);
    validateText(discount, setDiscountError, setValidateDiscount);
    validateText(quantity, setQuantityError, setValidateQuantity);
    validateText(sku, setSKUError, setValidateSku);
    validateNumber(price, setPriceError, setValidatePrice);
    validateNumber(discount, setDiscountError, setValidateDiscount);
    validatPriceDiscount(price, discount, setDiscountError, setValidateDiscount );
    validateNumber(quantity, setQuantityError, setValidateQuantity);
    validateQuantityNotLessThanZero(quantity, setQuantityError, setValidateQuantity);
    ValidateMedia(mediaFiles,setMediaError,setValidateMedia);
    if (validateProduct ===true && validateSku ===true && validatePrice ===true && validateDiscount === true && validateQuantity===true && validateCategory ===true && validateMedia ===true) {
      //appending form data into an formData variable
      var formData = new FormData();
      formData.append("product_name", product_name);
      formData.append("category_name", selectedCategory);
      formData.append("price", price);
      formData.append("discounted_price", discount);
      formData.append("quantity", quantity);
      formData.append("SKU", sku);
      formData.append("launch_date", launchDate);
      formData.append("description", description);
      formData.append("status", published);

      // loop to iterate the  images  stored in a variable  and append it to our  formData variable as an array of images
      for (let i = 0; i < mediaFiles.length; i++) {
        formData.append("images", mediaFiles[i]);
      }
      try {
        const response = await axios.post(`${API_URL}/add-product`, formData);
        // Handle the response as needed
        navigate(-1);
      } catch (error) {
        console.error("Error uploading product:", error);
        handleErrorToast();
      }
    }
  };

  //========================================================
  //handle for toast
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Product Already Exist ");
    SetShowToast(true);
  };
  //==========================================================
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

  //========================================================
  // handlers for input fields
  const handleProduct = (e) => {
    setProduct(e.target.value);
  };

  const handleCat = (selectedNodes) => {
    if (selectedNodes) {
      setSelectedCategory(selectedNodes.value);
      setCategoryName(selectedNodes.label);
    } else {
      setSelectedCategory(null);
    }
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleDiscountPrice = (e) => {
    setDiscount(e.target.value);
  };
  const handleDateChange = (selectedDate) => {
    setLaunchDate(selectedDate);
  };
  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleSKU = (e) => {
    setSKU(e.target.value);
  };
  const handleToggle = () => {
    if (published === 1) {
      setPublished(0);
    } else {
      setPublished(1);
    }
  };
  const onSelectFile = (e) => {
    const files = e.target.files;
    const selectedFiles = Array.from(files);
    const selectedImages = selectedFiles.filter((file) =>
      file.type.includes("image")
    );
    const selectedVids = selectedFiles.filter((file) =>
      file.type.includes("video")
    );
    // const combinedMedia = [...selectedImages, ...selectedVideos];
    // if (combinedMedia.length > 5) {
    //   // Handle the case when more than five images are selected
    //   setMediaError("You can select a maximum of five images.");
    //   return;
    // }
    setSelectedImages(selectedImages);
    setSelectedVideos(selectedVids);
  };

  //==========================================
  //image preview and handling
  const handlePreview = () => {
    setShowProductPreview(true);
  };
  const handleClosePreview = () => {
    setShowProductPreview(false);
  };
  const previewImage = (image) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      if (typeof e.target.result === "string") {
        img.src = e.target.result;
        img.style.width = "100%"; // Adjust the width as per your requirement
      } else {
        console.error("Error: Invalid image data.");
      }
    };
    reader.readAsDataURL(image);
  };

  //function to remove selected image
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const removedImage = updatedImages.splice(index, 1)[0];
    if (removedImage) {
      if (typeof removedImage === "string") {
        URL.revokeObjectURL(removedImage);
      } else if (removedImage instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(removedImage));
      }
      setSelectedImages(
        updatedImages.map((image, idx) => ({
          ...image,
          index: idx, // Shift the indexes after deletion
        }))
      );
    }
  };

  //=========================================
  //on cancel handler
  const onCancel = (e) => {
    navigate("/admin/product");
  };

  //==========================================
  const customStyles = {};

  //=============================================
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
      {/* ProductPreview component */}
      {showProductPreview && (
        <ProductPreview
          show={showProductPreview}
          handleClose={handleClosePreview}
          product={product_name}
          category={categoryName}
          sku={sku}
          images={selectedImages}
          videos={selectedVideos}
          price={price}
          description={description}
        />
      )}

      <div className="container-fluid">
        {/*  layout components */}
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>
          <main className="col-md-10 form-flex">
            <TopNavbar />
            <div className="row col-md-10">
              <div className="col-md-6">
                <p className="page-heading">Add Product</p>
              </div>

              <div className="col-md-6">
                <Link to="">
                  <Button
                    id="product-preview-btn"
                    className="mt-2 mb-2 add-btn"
                    onClick={handlePreview}
                  >
                    Product Preview
                  </Button>
                </Link>
              </div>
            </div>

            <form
              encType="multipart/FormData"
              method="post"
              className="col-md-11"
            >
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="product_name">Product Name*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="product_name"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleProduct}
                    placeholder="Product Name"
                  />
                  {productError && (
                    <div className="error-message">{productError}</div>
                  )}
                </div>
                <div className="col-md-8">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    onChange={handleToggle}
                  />
                  <label htmlFor="toggle" className="toggle-label" />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-5">
                  <label>Category*</label>
                  <div
                    style={{ height: "40px" }}
                    className="mb-1 mr-sm-2"
                    id="category-form-input-field"
                  >
                    <DropdownTreeSelect
                      data={treeData}
                      onChange={handleCat}
                      className="mdl-demo"
                     
                    />
                  </div>
                  {categoryError && (
                    <div className="error-message">{categoryError}</div>
                  )}
                </div>

                <div className="col-md-3">
                  <label htmlFor="price">Price Per Unit*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="price"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handlePrice}
                    placeholder=" Product Price"
                  />
                  {priceError && (
                    <div className="error-message">{priceError}</div>
                  )}
                </div>
                <div className="col-md-3">
                  <label htmlFor="price">Discounted Price*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="discountedprice"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleDiscountPrice}
                    placeholder=" Discounted Price"
                  />
                  {discountError && (
                    <div className="error-message">{discountError}</div>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <label htmlFor="price">Quantity*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="quantity"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleQuantity}
                    placeholder="Enter Product Quantity"
                  />
                  {QuantityError && (
                    <div className="error-message">{QuantityError}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label htmlFor="sub-category">SKU*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="sku"
                    className="form-control mb-1 mr-sm-2"
                    placeholder="Enter SKU "
                    onChange={handleSKU}
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
                      selected={launchDate}
                      onChange={handleDateChange}
                      className="date"
                      minDate={new Date()}
                      // Set the startDate prop to dbDate
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
                    onChange={handleDescription}
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>
              <div className="row mt-3 mb-5">
                <div className="col-md-3">
                  <label htmlFor="media">Upload Media</label>
                  <input
                    type="file"
                    name="media"
                    multiple
                    accept="image/*, video/*"
                    onChange={onSelectFile}
                  />
                    {mediaError && (
                    <div className="error-message">{mediaError}</div>
                  )}
                </div>
                <div className="col-md-9 media" style={{ display: "flex" }}>
                  {selectedImages &&
                    selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="image-wrapper"
                        id="image-preview-product"
                        style={{
                          height: "90px",
                          width: "100px",
                          margin: "5px",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onClick={() => previewImage(image)}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            border: '1px solid black',
                          }}
                        />
                      </div>
                    ))}
                  {selectedVideos &&
                    selectedVideos.map((video, index) => (
                      <div
                        key={index}
                        className="video-wrapper"
                        style={{
                          height: "90px",
                          width: "100px",
                          margin: "5px",
                          overflow: "hidden",
                          border: '1px solid black',
                        }}
                      >
                        <video
                          controls
                          style={{ height: "100%", width: "100%" }}
                        >
                          <source
                            src={URL.createObjectURL(video)}
                            type={video.type}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
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
      </div>
      <Outlet />
    </>
  );
}
