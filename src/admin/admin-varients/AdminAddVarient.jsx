import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { API_URL } from "../../helpers/config";
import { validateVariantName, validateVariantAttribute, } from "../../helpers/validations";
import ToastComponent from "../components/Toast";

export default function AddProductVarient() {
  const [varientName, setVarientName] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [varianNameError, setVariantNameError] = useState("");
  const [validateVariant, setValidateVariant] = useState(false);
  const [attributeError, setAttributeError] = useState("");
  const [validateAttribute, setValidateAttribute] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const handleVarient = (e) => {
    setVarientName(e.target.value);
  };
  const handleInputChange = (id, value) => {
    const updatedFields = inputFields.map((field) => {
      if (field.id === id) {
        return { ...field, value: value };
      }
      return field;
    });
    setInputFields(updatedFields);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Close the toast after 3 seconds
  };

  const addInputField = () => {
    setInputFields([...inputFields, { id: inputFields.length, value: "" }]);
  };

  const removeInputField = (id) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
  };
  const handleToastClose = () => setShowToast(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputFields.some((field) => !field.value.trim())) {
      showToastMessage("Enter attribute name");
    }
    validateVariantName(varientName, setVariantNameError, setValidateVariant);
    validateVariantAttribute(inputFields, setAttributeError, setValidateAttribute);
   

    if (validateVariant === true && validateAttribute === true) {
      const attributes = inputFields
        .map((field) => field.value)
        .filter((value) => value && value.trim() !== ""); // Filtering  empty and null values

      if (varientName && varientName.trim() !== "" && attributes.length > 0) {
        try {
          const response = await axios.post(`${API_URL}/add-variant`, {
            variant: varientName,
            attributes: attributes,
          });
          navigate(-1);
        } catch (error) {
          console.error("Error in adding Variant", error);
          showToastMessage("Variant already exist")
        }
      }
    }
  };
  const onCancel = () => {
    navigate(-1);
  };
  console.log(attributeError);
  return (
    <>
      {showToast && (
        <div className="toast-css">
          <ToastComponent
            showToast={showToast}
            onClose={handleToastClose}
            message={toastMessage}
            delay={3000}
          />
        </div>
      )}
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>

          <main className="col-md-10 " style={{ textAlign: "left" }}>
            <TopNavbar />
            <p className="page-heading ">Variants</p>
            <form onSubmit={(e) => e.preventDefault()} className="col-md-12  row">
              <div className="row">
                <div className="col-md-4 mb-4">
                  <label htmlFor="varientName">Varient Name*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="product_name"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleVarient}
                    placeholder="Varient Name"
                  />
                  {varianNameError && <div className="error-message">{varianNameError}</div>}
                  {attributeError && <div className="error-message">{attributeError}</div>}
                </div>
              </div>
              <div className="row col-md-12">
                {inputFields.map((field, index) => (
                  <div key={field.id} className="col-md-4 mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        name="text"
                        className="form-control"
                        placeholder="Attribute"
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeInputField(field.id)}
                        className="btn btn-danger"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addInputField} className="col-md-1 button-add-cat">
                Add +
              </button>
              <button type="button" onClick={handleSubmit} className="col-md-1 button-add-cat">
                Save
              </button>

              <button type="button" className="col-md-1 button-cancel-cat" onClick={onCancel}>
                Cancel
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
