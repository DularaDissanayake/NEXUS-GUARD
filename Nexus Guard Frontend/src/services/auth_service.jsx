import axios from 'axios';

// Base URL of your FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Sends a request to create a new user in the database.
 * @param {Object} userData - Object containing firstname, lastname, email_address, password, active_status
 * @returns {Promise<Object>} - The created user response data from FastAPI
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/`, userData);
    return response.data;
  } catch (error) {
    // Extract FastAPI's error details (e.g., email already exists or validation errors)
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { detail: error.message };
  }
};


/**
 * Sends login credentials to the FastAPI backend.
 * @param {Object} credentials - Object containing email_address and password
 * @returns {Promise<Object>} - The login response data and user profile
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    // Extract FastAPI error details (e.g., 401 Unauthorized messages)
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { detail: error.message };
  }
};