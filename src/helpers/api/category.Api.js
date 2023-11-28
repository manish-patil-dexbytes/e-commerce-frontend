import axios from "axios";
import { API_URL } from "../config";

// Function to update category status
const updateCategoryStatus = async (id, updatedStatus) => {
  try {
    // Make a PUT request to update the category status
    const response = await axios.put(
      `${API_URL}/categories-status/status/${id}`, // API endpoint for updating category status
      {
        status: updatedStatus, // Updated status to be sent in the request body
      }
    );
    // Check if the record was updated successfully based on the response message
    if (
      response.data &&
      response.data.message === "Record updated successfully"
    ) {
      return true; // Return true if the record was updated successfully
    }
  } catch (error) {
    console.error("Error saving record:", error); // Log an error if there's an issue during the update process
  }
};

// Export the updateCategoryStatus function to be used in other modules
export { updateCategoryStatus };
