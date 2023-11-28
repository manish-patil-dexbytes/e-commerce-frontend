import axios from "axios";
import { API_URL } from "../config";

// Creating an instance of axios with a base URL set to API_URL
const api = axios.create({
  baseURL: API_URL,
});

// Function to update the status of a product using a PUT request to a specific endpoint
const updateProductStatus = async (id, updatedStatus) => {
  try {
    // Sending a PUT request to update the product status by ID
    const response = await api.put(`/product-status/status/${id}`, {
      status: updatedStatus,
    });

    // Returning true if the status update was successful
    return (
      response.data && response.data.message === "Record updated successfully"
    );
  } catch (error) {
    // Handling and logging errors if there's an issue during the status update
    console.error("Error updating record:", error);
    throw error;
  }
};

// Exporting the updateProductStatus function to be used in other modules
export {
  updateProductStatus,
};
