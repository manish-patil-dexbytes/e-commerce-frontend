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

export default function ProductVariant() {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-variant`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteVariant = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteVariant/${id}`);
      if (response.data.success) {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
      cell: (row) => <div>{row.attributes}</div>,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div key={index}>
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
  const handleEdit = (row) => {
    const selectedRow = data.find((item) => item.id === row);
    if (selectedRow) {
      setSelectedRecord(selectedRow);
      setIsEditing(true);
    }
  };

const handleSaveEdit = async () => {
  setIsEditing(false);
  try {
    const response = await axios.get(`${API_URL}/get-variant`);
    setData(response.data);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

  return (
    <>
      {isEditing && selectedRecord && (
        <EditVariant
          record={selectedRecord}
          onSave={handleSaveEdit}
          onCancel={() => {
            setSelectedRecord(null); // Updated state variable correctly
            setIsEditing(false);
          }}
        />
      )}
      {isEditing || (
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 bg-light sidebar">
              <div className="position-fixed">
                <NavigationBar />
              </div>
            </nav>

            <main className="col-md-10 " style={{ textAlign: "left" }}>
              <TopNavbar />

              <p className="page-heading">Variants</p>
              <div className="col-md-11 table-css">
                <Link to="/admin/varients/add">
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
