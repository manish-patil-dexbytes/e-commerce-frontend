
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import NavigationBar from "../components/AdminSideNavBar";
// import TopNavbar from "../components/AdminTopNavBar";

// export default function AddProductVarient() {
//   const [varientName, setVarientName] = useState("");
//   const [inputFields, setInputFields] = useState([]);

//   const handleVarient = (e) => {
//     setVarientName(e.target.value);
//   };

//   const addInputField = () => {
//     setInputFields([...inputFields, { id: inputFields.length }]);
//   };

//   const removeInputField = () => {
//     if (inputFields.length > 0) {
//       const updatedFields = inputFields.slice(0, inputFields.length - 1);
//       setInputFields(updatedFields);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add your form submission logic here
//     console.log("Form submitted");
//   };

//   return (
//     <>
//       <div className="container-fluid">
//         <div className="row">
//           <nav className="col-md-2 bg-light sidebar">
//             <div className="position-fixed">
//               <NavigationBar />
//             </div>
//           </nav>

//           <main className="col-md-10 " style={{ textAlign: "left" }}>
//             <TopNavbar />
//             <p className="page-heading ">Varients</p>
//             <form onSubmit={handleSubmit} className="col-md-11">
//               <div className="row">
//                 <div className="col-md-4">
//                   <label htmlFor="varientName">Varient Name</label>
//                   <input
//                     id="category-form-input-field"
//                     type="text"
//                     name="product_name"
//                     className="form-control mb-1 mr-sm-2"
//                     onChange={handleVarient}
//                     placeholder="Varient Name"
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 <div id="formfield" className="col-md-4 ">
//                   {inputFields.map((field, index) => (
//                     <input
//                       key={field.id}
//                       type="text"
//                       name="text"
//                       className="text"
//                     />
//                   ))}
//                   <button type="button" onClick={addInputField} className="col-md-1">
//                   +
//                 </button>
//                 </div>
                
//                 <button type="button" onClick={removeInputField}>
//                   Remove Field
//                 </button>
//               </div>
//               <button type="submit">Submit</button>
//             </form>
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";

export default function AddProductVarient() {
  const [varientName, setVarientName] = useState("");
  const [inputFields, setInputFields] = useState([]);

  const handleVarient = (e) => {
    setVarientName(e.target.value);
  };

  const addInputField = () => {
    setInputFields([...inputFields, { id: inputFields.length }]);
  };

  const removeInputField = (id) => {
    const updatedFields = inputFields.filter((field) => field.id !== id);
    setInputFields(updatedFields);
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
            <form onSubmit={(e) => e.preventDefault()} className="col-md-4 ">
              <div className="">
                {inputFields.map((field, index) => (
                  <div key={field.id} className="col-md-12 mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        name="text"
                        className="form-control"
                        placeholder="Optional Field"
                      />
                      <button
                        type="button"
                        onClick={() => removeInputField(field.id)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addInputField} className="btn btn-primary mb-3">
                +
              </button>
            
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
