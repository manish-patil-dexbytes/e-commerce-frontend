import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../../styles/Admin.css";
import { API_URL } from "../../helpers/config";
import { Link, Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import NavigationBar from "../components/AdminSideNavBar";
import TopNavbar from "../components/AdminTopNavBar";
import { DeleteSvg, EditSvg } from "../components/SVG";
import EditVariant from "./AdminEditVariant";
import { deleteData, getData } from "../../helpers/api/general.Api";

export default function ProductVariant() {
  // State variables initialization
  const [data, setData] = useState([]); // Data state for variants
  const [isEditing, setIsEditing] = useState(false); // Editing flag state
  const [selectedRecord, setSelectedRecord] = useState(null); // State to store selected variant for editing

  // Function to fetch variants data
  const getVariant = async (filter = "") => {
    try {
      const filteredData = await getData(`/get-variant`);
      const filteredVariants = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
      setData(filteredVariants);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  // Fetch variants data on component mount
  useEffect(() => {
    getVariant();
  }, []);
  // Function to handle deletion of a variant
  const handleDeleteVariant = async (id) => {
    try {
      const response = await deleteData(`/deleteVariant/${id}`);
      if (response.success) {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // Column configuration for the DataTable
  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Attributes",
      selector: "attributes",
      sortable: true,
      cell: (row) => (
        <div>
          {row.attributes.split(",").map((attribute, index) => (
            <span key={index}>
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
              {index < row.attributes.split(",").length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div key={index}>
          {/* Edit and delete buttons */}
          <button style={{ border: "none" }} onClick={() => handleEdit(row.id)}>
            <EditSvg />
          </button>
          <button
            style={{ marginLeft: "5px", border: "none" }}
            onClick={() => handleDeleteVariant(row.id)}
          >
            <DeleteSvg />
          </button>
        </div>
      ),
    },
  ];
  // Function to handle editing of a variant
  const handleEdit = (row) => {
    const selectedRow = data.find((item) => item.id === row);
    if (selectedRow) {
      setSelectedRecord(selectedRow); // Set the selected variant to edit
      setIsEditing(true); // Activate editing mode
    }
  };
  // Function to save edited variant
  const handleSaveEdit = async () => {
    setIsEditing(false); // Disable editing mode
    try {
      const response = await axios.get(`${API_URL}/get-variant`); // Fetch updated data
      setData(response.data); // Update the state with the latest data
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <>
      {/* Conditionally render the EditVariant component when in editing mode */}
      {isEditing && selectedRecord && (
        <EditVariant
          record={selectedRecord}
          onSave={handleSaveEdit}
          onCancel={() => {
            setSelectedRecord(null); // Updated state variable correctly
            setIsEditing(false); // Disable editing mode
          }}
        />
      )}
      {/* Render content when not in editing mode */}
      {isEditing || (
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 bg-light sidebar">
              <div className="position-fixed">
                <NavigationBar />
              </div>
            </nav>

            <main className="col-md-10 " style={{ textAlign: "left" }}>
              {/* Top navigation bar */}
              <TopNavbar handleFilter={getVariant} />

              <p className="page-heading">Variants</p>
              <div className="col-md-11 table-css">
                <Link to="/admin/varients/add">
                  {/* Button to add a new variant */}
                  <Button
                    style={{
                      color: "black",
                      backgroundColor: "#ea7c0f",
                      borderColor: "#e3974b",
                      transition: "background-color 0.1s",
                    }}
                    className="mt-2 mb-2 add-btn"
                  >
                    Add
                  </Button>
                </Link>
                {/* Render DataTable */}
                {data.length > 0 ? (
                  <div>
                    <DataTable columns={columns} data={data} />
                  </div>
                ) : (
                  <div>No Variants Found</div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}