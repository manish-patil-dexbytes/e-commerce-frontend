import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { validateCategory } from "../../helpers/validations";
import { API_URL } from "../../helpers/config";

export default function AddProductVarient() {
  const [varientName, setVarientName] = useState("");
  const [inputFields, setInputFields] = useState([]);

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

  const addInputField = () => {
    setInputFields([...inputFields, { id: inputFields.length, value: "" }]);
  };

  const removeInputField = (id) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   const formData = {
    //     variant: varientName,
    //     attributes: inputFields.map((field) => field.value),
    //   };
    //   const response = await axios.post(`${API_URL}/add-variant`, formData);
    //   console.log(response.data); // Log the response data for debugging
    // } catch (error) {
    //   console.error("Error in adding Variant:", error);
    // }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 bg-light sidebar">
            <div className="position-fixed">
              <NavigationBar />
            </div>
          </nav>

          <main className="col-md-10 " style={{ textAlign: "left" }}>
            <TopNavbar />
            <p className="page-heading ">Varients</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="col-md-12  row "
            >
              <div className="row">
                <div className="col-md-4 mb-4">
                  <label htmlFor="varientName">Varient Name</label>
                  <input
                    id="category-form-input-field"
                    type="text"
                    name="product_name"
                    className="form-control mb-1 mr-sm-2"
                    onChange={handleVarient}
                    placeholder="Varient Name"
                  />
                </div>
              </div>

              <div className=" row col-md-12">
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

              <button
                type="button"
                onClick={addInputField}
                className=" col-md-1 button-add-cat"
              >
                Add +
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className=" col-md-1 button-add-cat"
              >
                Save
              </button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
