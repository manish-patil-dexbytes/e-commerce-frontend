import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});



const updateProductStatus = async (id, updatedStatus) => {
  try {
    const response = await axios.put(`${API_URL}/product-status/status/${id}`, {
      status: updatedStatus,
    });
    return (
      response.data && response.data.message === "Record updated successfully"
    );
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

export {

  updateProductStatus,
};

//==================================================================
