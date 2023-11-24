import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import {
  validateVariantName,
  validateVariantAttribute,
} from "../../helpers/validations";
import ToastComponent from "../components/Toast";
import { postData } from "../../helpers/api/general.Api";
export default function AddProductVariant() {
  const [variantName, setVariantName] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [variantNameError, setVariantNameError] = useState("");
  const [validateVariant, setValidateVariant] = useState(false);
  const [attributeError, setAttributeError] = useState("");
  const [validateAttribute, setValidateAttribute] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const handleVariant = (e) => {
    setVariantName(e.target.value);
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
    validateVariantName(variantName, setVariantNameError, setValidateVariant);
    validateVariantAttribute(
      inputFields,
      setAttributeError,
      setValidateAttribute
    );
    if (validateVariant === true && validateAttribute === true) {
      const uniqueAttributes = Array.from(
        new Set(inputFields.map((field) => field.value.trim().toLowerCase()))
      ).filter((value) => value.trim() !== "");

      setInputFields(
        uniqueAttributes.map((attr, index) => ({ id: index, value: attr }))
      );
      if (
        variantName &&
        variantName.trim() !== "" &&
        uniqueAttributes.length > 0
      ) {
        try {
          const response = await postData(`/add-variant`, {
            variant: variantName,
            attributes: uniqueAttributes,
          });
          navigate(-1);
        } catch (error) {
          console.error("Error in adding Variant", error);
          showToastMessage("Variant already exists");
        }
      }
    }
  };
  const onCancel = () => {
    navigate(-1);
  };
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
            <TopNavbar showSearchBar={false} />
            <p className="page-heading ">Variants</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="col-md-12  row"
            >
              <div className="row">
                <div className="col-md-4 mb-4">
                  <label htmlFor="variantName">Variant Name*</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="product_name"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleVariant}
                    placeholder="Variant Name"
                  />
                  {variantNameError && (
                    <div className="error-message">{variantNameError}</div>
                  )}
                  {attributeError && (
                    <div className="error-message">{attributeError}</div>
                  )}
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
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
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
              <div style={{ marginLeft: "-30px" }}>
                <button
                  type="button"
                  onClick={addInputField}
                  className="col-md-1 button-add-cat"
                >
                  Add +
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="col-md-1 button-add-cat"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="col-md-1 button-cancel-cat"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
