import axios from "axios";
import { API_URL } from "../config";

const updateCategoryStatus = async (id, updatedStatus) => {
  try {
    const response = await axios.put(
      `${API_URL}/categories-status/status/${id}`,
      {
        status: updatedStatus,
      }
    );
    if (
      response.data &&
      response.data.message === "Record updated successfully"
    ) {
      return true;
    }
  } catch (error) {
    console.error("Error saving record:", error);
  }
};



export {  updateCategoryStatus };
