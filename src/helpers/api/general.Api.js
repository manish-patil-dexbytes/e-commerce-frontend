import axios from "axios";
import { API_URL } from "../config";

// Creating an instance of axios with a base URL set to API_URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Function to send POST requests to add data to a specific endpoint
const postData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.post(endpoint, data); // Sending a POST request with provided data
    return response.data; // Returning the response data after a successful POST request
  } catch (error) {
    throw error; // Throwing an error if there's an issue during the POST request
  }
};

// Function to send GET requests to retrieve data from a specific endpoint
const getData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint); // Sending a GET request to retrieve data
    return response.data; // Returning the retrieved data after a successful GET request
  } catch (error) {
    throw error; // Throwing an error if there's an issue during the GET request
  }
};

// Function to send PUT requests to update data at a specific endpoint
const updateData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.put(endpoint, data); // Sending a PUT request with updated data
    return response.data; // Returning the response data after a successful PUT request
  } catch (error) {
    throw error; // Throwing an error if there's an issue during the PUT request
  }
};

// Function to send DELETE requests to delete data at a specific endpoint
const deleteData = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint); // Sending a DELETE request to delete data
    return response.data; // Returning the response data after a successful DELETE request
  } catch (error) {
    throw error; // Throwing an error if there's an issue during the DELETE request
  }
};

// Exporting the deleteData, postData, updateData, and getData functions to be used in other modules
export { deleteData, postData, updateData, getData };

