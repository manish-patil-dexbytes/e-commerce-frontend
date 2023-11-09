import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteProduct/${id}`);
    return response.data.success;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const addProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/add-product`, formData);
    return response;
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

const editProduct = async (formData) => {
  try {
    const response = await api.put("/edit-product", formData);
    return response.data;
  } catch (error) {
    console.error("Error editing product:", error);
    throw error;
  }
};

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
  getCategories,
  editProduct,
  addProduct,
  deleteProduct,
  updateProductStatus,
};

//==================================================================
