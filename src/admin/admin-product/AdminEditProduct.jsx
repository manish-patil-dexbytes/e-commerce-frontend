import React, { useState, useEffect } from "react";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import "../../styles/Admin.css";
import { Outlet } from "react-router-dom";
import { API_URL } from "../../helpers/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TreeSelect from "rc-tree-select";
import {
  validateText,
  validateNumber,
  validatPriceDiscount,
  validateQuantityNotLessThanZero,
  validateAlphaNumeric,
  ValidateMedia,
} from "../../helpers/validations";
import { getData, updateData } from "../../helpers/api/general.Api";

export default function EditProduct({ record, onCancel, onSave }) {
  // State declarations
  const [editedData, setEditedData] = useState({ ...record }); //hook for holding edited data
  const [dbDate, setDbdate] = useState(); //date
  const [launchDate, setLaunchDate] = useState(dbDate);
  const [selectedImages, setSelectedImages] = useState([]); // set selected images in array
  const [selectFields, setSelectFields] = useState([]);
  const [attributes, setAttributes] = useState([]); //hook to hold attributes
  const [variants, setVariants] = useState([]); //hook to hold variants
  //==============================================
  //validation states
  const [productError, setProductError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [QuantityError, setQuantityError] = useState("");
  const [SKUError, setSKUError] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [validateProduct, setValidateProduct] = useState(false);
  const [validateSku, setValidateSku] = useState(false);
  const [validatePrice, setValidatePrice] = useState(false);
  const [validateDiscount, setValidateDiscount] = useState(false);
  const [validateQuantity, setValidateQuantity] = useState(false);
  const [validateCategory, setValidateCategory] = useState(false);
  const [validateMedia, setValidateMedia] = useState(false);
  //==============================================
  // Logic to extract unique images
   if(editedData.images){
   var uniqueImages = Array.from(new Set(editedData.images.split(",")));};
  // Function to convert date format
  const convertToDate = () => {
    const dateParts = record.lauch_date.split("/");
    const validDate = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    setDbdate(validDate);
  };
  //====================================
  // Event handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  // Functions to handle variant and attribute changes
  const handleAddSelectFields = () => {
    setSelectFields([
      ...selectFields,
      { variant: "", attributes: [] }, // Initialize with empty values
    ]);
  };
  // Function to remove select fields
  const handleRemoveSelectFields = (indexToRemove) => {
    const updatedFields = selectFields.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectFields(updatedFields);
  };
  //function to handle  variant change
  const handleVariantChange = (value, index) => {
    const updatedFields = [...selectFields];
    updatedFields[index].variant = value;
    setSelectFields(updatedFields);
  };
  //function to handle attribute change
  const handleAttributeChange = (value, index) => {
    const updatedFields = [...selectFields];
    updatedFields[index].attributes = value;
    setSelectFields(updatedFields);
  };
  // Event handler for category change
  const handleCategoryChange = (selectedNodes) => {
    setEditedData({
      ...editedData,
      category_id: selectedNodes,
    });
  };
  // Function to handle file selection
  const onSelectFile = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files);
    setSelectedImages(selectedImages);
  };
  // Event handler for date change
  const handleDateChange = (selectedDate) => {
    setLaunchDate(selectedDate);
    setDbdate(selectedDate); // Update the dbDate with the selected date
  };
  // Function to preview image
  const previewImage = (image) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "100%"; // Adjust the width as per your requirement
    };
    reader.readAsDataURL(image); //creating an URL for image src in preview div
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation logic and form submission
    validateText(editedData.product_name, setProductError, setValidateProduct);
    validateText(editedData.category_id, setCategoryError, setValidateCategory);
    validateAlphaNumeric(editedData.sku, setSKUError, setValidateSku);
    validateText(editedData.price, setPriceError, setValidatePrice);
    validateText(
      editedData.discounted_price,
      setDiscountError,
      setValidateDiscount
    );
    validateText(editedData.quantity, setQuantityError, setValidateQuantity);
    validateText(editedData.sku, setSKUError, setValidateSku);
    validateNumber(editedData.price, setPriceError, setValidatePrice);
    validateNumber(
      editedData.discounted_price,
      setDiscountError,
      setValidateDiscount
    );
    validatPriceDiscount(
      editedData.price,
      editedData.discounted_price,
      setDiscountError,
      setValidateDiscount
    );
    validateNumber(editedData.quantity, setQuantityError, setValidateQuantity);
    validateQuantityNotLessThanZero(
      editedData.quantity,
      setQuantityError,
      setValidateQuantity
    );
    ValidateMedia(selectedImages, setMediaError, setValidateMedia);
    if (
      validateProduct === true &&
      validateSku === true &&
      validatePrice === true &&
      validateDiscount === true &&
      validateQuantity === true &&
      validateCategory === true &&
      validateMedia === true
    ) {
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
      // Formatting data for variants and attributes
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
      try {
        await updateData(`/edit-product`, formData);
        onSave();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const formatedData = [];
  if (editedData.attributes != null) {
    const variantEntries = Object.entries(editedData.attributes);
    // Iterating through the array of entries to access each variant and its attributes
    variantEntries.forEach(([variant, attributes]) => {
      const dataObject = {
        variant,
        attributes,
      };
      formatedData.push(dataObject);
    });
  }
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
  //==============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching categories data
        const data = await getData(`/categories`);
        const formattedData = buildTree(data);
        setTreeData(formattedData);
        convertToDate();
        // Fetching variants data
        const variantData = await getData(`/variants`);
        setVariants(variantData);
        // Fetching attributes data
        const attributeData = await getData(`/attributes`);
        setAttributes(attributeData);
      } catch (error) {
        console.error("Error fetching data from the server:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    // Updating selectFields based on formatedData
    const formattedSelectFields = formatedData.map((data) => ({
      variant: data.variant,
      attributes: data.attributes,
    }));
    setSelectFields(formattedSelectFields);
  }, []);
  //=============================================
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
          <TopNavbar showSearchBar={false} />
          <p className="page-heading">Edit Product</p>
          {/* Form for editing product */}
          <form encType="multipart/FormData" className="col-md-11">
            {/* Form fields */}
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="product_name">Product Name</label>
                {/* input for product name  */}
                <input
                  id="category-form-input-field"
                  type="text"
                  name="product_name"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.product_name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                />
                {/* product error messages  */}
                {productError && (
                  <div className="error-message">{productError}</div>
                )}
              </div>
            </div>
            <div className="row">
              {selectFields.map((fields, index) => (
                <div key={index} className="col-md-12 mb-2">
                  <div className="row">
                    {/* Variants and attributes */}
                    <div className="col-md-4">
                      <label htmlFor={`variant-${index}`}>
                        Select Variant*
                      </label>
                      <div
                        className="mb-1 mr-sm-2 form-control"
                        id="category-form-input-field"
                        style={{ height: "40px" }}
                      >
                        {/* select for variants  */}
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
                        {/* select for  attributes  */}
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
                <label>Category</label>
                <div
                  style={{ height: "40px" }}
                  className=" form-control mb-1 mr-sm-2 "
                  id="category-form-input-field"
                >
                  {/* select for category  */}
                  <TreeSelect
                    treeData={treeData}
                    value={editedData.category_id}
                    onChange={handleCategoryChange}
                    placeholder={<span>Please Select a Category</span>}
                    style={{ width: 300 }}
                    dropdownStyle={{
                      maxHeight: 200,
                      overflow: "auto",
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
                <label htmlFor="price">Price Per Unit</label>
                {/* input for price per unit  */}
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
                {/* input for discounted price  */}
                <label htmlFor="price">Discounted Price</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="discounted_price"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.discounted_price}
                  onChange={handleInputChange}
                  placeholder="Discounted Price"
                />
                {discountError && (
                  <div className="error-message">{discountError}</div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                {/* input field for quantity  */}
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
                {/* input for SKU  */}
                <label htmlFor="sub-category">SKU</label>
                <input
                  id="category-form-input-field"
                  type="text"
                  name="sku"
                  className="form-control mb-1 mr-sm-2"
                  value={editedData.sku}
                  placeholder="Enter SKU"
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
                  {/* launch date input field  */}
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
                {/* text area for description  */}
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
                {/* input field for media  */}
                <label for="image">Upload Media</label>
                <input
                  type="file"
                  name="image"
                  multiple
                  onChange={onSelectFile}
                />
              </div>
              <div className="col-md-4 images" style={{ display: "flex" }}>
                {/* image preview  */}
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
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`productc Image ${index}`}
                        id="selected-product-img"
                      />
                    </div>
                  ))
                ) : editedData && editedData.images ? (
                  uniqueImages.map((imageName, index) => (
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
                  // if no image for product then default image
                  <img
                    src={
                      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                    }
                    alt=""
                    className="selected-edit-image"
                    style={{
                      marginLeft: "10px",
                      border: "1px solid black",
                    }}
                  />
                )}
              </div>
              {mediaError && <div className="error-message">{mediaError}</div>}
            </div>
            <div className="row mt-3">
              {/* cancel and save buttons  */}
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
