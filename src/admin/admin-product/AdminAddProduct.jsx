import "react-dropdown-tree-select/dist/styles.css";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "../../styles/Admin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, Link, Outlet } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import ProductPreview from "./AdminPreviewProduct";
import TreeSelect from "rc-tree-select";
import {
  validateText,
  validateNumber,
  validatPriceDiscount,
  validateQuantityNotLessThanZero,
  validateAlphaNumeric,
  ValidateMedia,
} from "../../helpers/validations";
import ToastComponent from "../components/Toast";
import { getData, postData } from "../../helpers/api/general.Api";

export default function AddProduct() {
  // State declarations for various form fields and validation errors
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState(""); //state to pass category  name to preview model
  const [showProductPreview, setShowProductPreview] = useState(false); //state the set preview
  const [launchDate, setLaunchDate] = useState(new Date()); // or any default date in the format "DD/MM/YYYY"
  const [product_name, setProduct] = useState(""); //product name
  const [price, setPrice] = useState(); //set price
  const [quantity, setQuantity] = useState(); //set quantity
  const [description, setDescription] = useState(""); //set description
  const [discount, setDiscount] = useState(""); //set discount
  const [sku, setSKU] = useState(""); //set sku
  const [selectedImages, setSelectedImages] = useState([]); // set selected images in array
  const [published, setPublished] = useState(1); //staus
  const [selectedVideos, setSelectedVideos] = useState([]);
  const mediaFiles = [...selectedImages, ...selectedVideos];
  const [attributes, setAttributes] = useState([]);
  const [selectFields, setSelectFields] = useState([]);
  const [showToast, SetShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [treeData, setTreeData] = useState([]); //hook for holding category data from api
  const [variants, setVariants] = useState([]); //hook for holding the variants from api
  //validations states
  const [productError, setProductError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [QuantityError, setQuantityError] = useState("");
  const [SKUError, setSKUError] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [validateProduct, setValidateProduct] = useState(false);
  const [validateSku, setValidateSku] = useState(false);
  const [validatePrice, setValidatePrice] = useState(false);
  const [validateDiscount, setValidateDiscount] = useState(false);
  const [validateQuantity, setValidateQuantity] = useState(false);
  const [validateCategory, setValidateCategory] = useState(false);
  const [validateMedia, setValidateMedia] = useState(false);
  const navigate = useNavigate();
  //=======================================================
  // useEffect to fetch data (categories, variants, attributes) on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getData(`/categories`);
        const formattedCategories = buildTree(categories);
        setTreeData(formattedCategories);

        const variantData = await getData(`/variants`);
        setVariants(variantData);

        const attributeData = await getData(`/attributes`);
        setAttributes(attributeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  // Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    // Form validation logic and API call to add a new product
    validateText(product_name, setProductError, setValidateProduct);
    validateText(selectedCategory, setCategoryError, setValidateCategory);
    validateAlphaNumeric(sku, setSKUError, setValidateSku);
    validateText(price, setPriceError, setValidatePrice);
    validateText(discount, setDiscountError, setValidateDiscount);
    validateText(quantity, setQuantityError, setValidateQuantity);
    validateText(sku, setSKUError, setValidateSku);
    validateNumber(price, setPriceError, setValidatePrice);
    validateNumber(discount, setDiscountError, setValidateDiscount);
    validatPriceDiscount(
      price,
      discount,
      setDiscountError,
      setValidateDiscount
    );
    validateNumber(quantity, setQuantityError, setValidateQuantity);
    validateQuantityNotLessThanZero(
      quantity,
      setQuantityError,
      setValidateQuantity
    );
    ValidateMedia(mediaFiles, setMediaError, setValidateMedia);
    try {
      if (
        validateProduct === true &&
        validateSku === true &&
        validatePrice === true &&
        validateDiscount === true &&
        validateQuantity === true &&
        validateCategory === true &&
        validateMedia === true
      ) {
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
        //===================================================
        // Assuming 'selectedFields' holds the array of objects you mentioned
        for (let i = 0; i < selectFields.length; i++) {
          formData.append(`variants[${i}][variant]`, selectFields[i].variant);
          // Assuming 'attributes' in each object is an array
          for (let j = 0; j < selectFields[i].attributes.length; j++) {
            formData.append(
              `variants[${i}][attributes][]`,
              selectFields[i].attributes[j]
            );
          }
        }
        const response = await postData(`/add-product`, formData);
        navigate(-1);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      handleErrorToast();
    }
  };
  //=========================================================
  // Function to build a tree structure for categories and subcategories
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
  //handle for toast
  const handleToastClose = () => SetShowToast(false);
  const handleErrorToast = () => {
    setMessage("Product Already Exist ");
    SetShowToast(true);
  };
  //=========================================================
  // Functions for handling form inputs and setting state values
  const handleAddSelectFields = (e) => {
    setSelectFields([...selectFields, { variant: "", attributes: [] }]);
  };
  // Handlers for adding, removing, and manipulating variant fields
  const handleRemoveSelectFields = (index) => {
    const updatedFields = [...selectFields];
    updatedFields.splice(index, 1);
    setSelectFields(updatedFields);
  };

  const handleVariantChange = (value, index) => {
    const updatedFields = [...selectFields];
    updatedFields[index].variant = value;
    setSelectFields(updatedFields);
  };

  const handleAttributeChange = (value, index) => {
    const updatedFields = [...selectFields];
    updatedFields[index].attributes = value;
    setSelectFields(updatedFields);
  };

  // handlers for input fields
  const handleProduct = (e) => {
    setProduct(e.target.value);
  };
  const handleCat = (selectedNodes) => {
    if (selectedNodes) {
      setSelectedCategory(selectedNodes);
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
  // Handler for toggling product status
  const handleToggle = () => {
    if (published === 1) {
      setPublished(0);
    } else {
      setPublished(1);
    }
  };
  // Handlers for handling file selection and previewing images
  const onSelectFile = (e) => {
    const files = e.target.files;
    const selectedFiles = Array.from(files);
    const selectedImages = selectedFiles.filter((file) =>
      file.type.includes("image")
    );
    const selectedVids = selectedFiles.filter((file) =>
      file.type.includes("video")
    );
    setSelectedImages(selectedImages);
    setSelectedVideos(selectedVids);
  };
  //==========================================
  //image preview and handling
  const handlePreview = () => {
    setShowProductPreview(true);
  };
  // Handler for closing the product preview modal
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
  // Handler for onCancel button click
  const onCancel = (e) => {
    navigate("/admin/product");
  };
  //==========================================
  return (
    <>
      {showToast && (
        //ProductPreview component for displaying product preview
        <div className="toast-css">
          <ToastComponent
            showToast={showToast}
            onClose={handleToastClose}
            message={message}
            delay={3000}
          />
        </div>
      )}

      {showProductPreview && (
        // ProductPreview component for displaying product preview
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
        {/* The main layout structure for adding a new product */}
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              {/* Sidebar and main content layout */}
              <NavigationBar />
            </div>
          </nav>
          <main className="col-md-10 form-flex">
            {/* Top navigation bar */}
            <TopNavbar showSearchBar={false} />
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
            {/* Form for adding a new product */}
            <form
              encType="multipart/FormData"
              method="post"
              className="col-md-11"
            >
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="product_name">Product Name*</label>
                  {/* product name input */}
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
                  {/* toogle button for status */}
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    onChange={handleToggle}
                  />
                  <label htmlFor="toggle" className="toggle-label" />
                </div>
              </div>
              <div className="row">
                {/* select for variants  */}
                {selectFields.map((fields, index) => (
                  <div key={index} className="col-md-12 mb-2">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor={`variant-${index}`}>
                          Select Variant*
                        </label>
                        <div
                          className="mb-1 mr-sm-2 form-control"
                          id="category-form-input-field"
                          style={{ height: "40px" }}
                        >
                          <TreeSelect
                            treeData={variants.map((item) => ({
                              title: item.name,
                              value: item.id,
                            }))}
                            value={fields.variant}
                            onChange={(value) =>
                              handleVariantChange(value, index)
                            }
                            placeholder={<span>Select a Variant</span>}
                            style={{ width: "100%" }}
                            allowClear
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label>Attributes*</label>
                        <div
                          className="mb-1 mr-sm-2 form-control"
                          id="category-form-input-field"
                        >
                          {/* select for attributes  */}
                          <TreeSelect
                            treeData={attributes.map((item) => ({
                              title: item.attribute,
                              value: item.id,
                            }))}
                            value={fields.attributes}
                            onChange={(value) =>
                              handleAttributeChange(value, index)
                            }
                            placeholder="Select Attributes"
                            style={{ width: "100%" }}
                            treeCheckable
                            multiple
                          />
                        </div>
                      </div>
                      <div className="col-md-2" style={{ marginTop: "22px" }}>
                        {index === selectFields.length - 1 && (
                          <button
                            onClick={() => handleRemoveSelectFields(index)}
                            className="button-cancel-cat"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-md-12 mt-2">
                  <button
                    type="button"
                    onClick={handleAddSelectFields}
                    className="button-add-cat"
                    style={{ marginTop: "-30px", marginLeft: "1px" }}
                  >
                    Add Variants
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <label>Category*</label>
                  <div
                    style={{ height: "40px" }}
                    className="mb-1 mr-sm-2 form-control"
                    id="category-form-input-field"
                  >
                    {/* category select input  */}
                    <TreeSelect
                      treeData={treeData}
                      onChange={handleCat}
                      placeholder={<span>Please Select a Category</span>}
                      style={{ width: 300 }}
                      dropdownStyle={{
                        maxHeight: 200,
                        zIndex: 1500,
                      }}
                      showSearch={false}
                      allowClear
                      switcherIcon
                    />
                  </div>
                  {categoryError && (
                    <div className="error-message">{categoryError}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label htmlFor="price">Price Per Unit*</label>
                  {/* price input field  */}
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
                <div className="col-md-4">
                  <label htmlFor="price">Discounted Price*</label>
                  {/* discounted price input field  */}
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
                  {/* quantity input field  */}
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
                  {/* SKU input field  */}
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
                  <label htmlFor="price">Launch Date*</label>
                  <div
                    id="category-form-input-field"
                    className="form-control mb-1 mr-sm-2"
                  >
                    {/* date picker for selecting data  */}
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={launchDate}
                      onChange={handleDateChange}
                      className="date"
                      minDate={new Date()} // allow only present and future dates
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div>
                  <label>Description:</label>
                  {/* textarea for description   */}
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
                  {/* media input field for images and videos  */}
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
                {/* preview of selected images  */}
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
                            border: "1px solid black",
                          }}
                        />
                      </div>
                    ))}
                  {/* selected videos preview */}
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
                          border: "1px solid black",
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
                        </video>
                      </div>
                    ))}
                </div>
              </div>
              <div className="row mt-3">
                <div id="produc-submit-cancel-btn">
                  {/* buttons for submit and cancel  */}
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
