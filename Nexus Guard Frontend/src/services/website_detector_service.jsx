import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Sends a website URL to the FastAPI backend for trust analysis.
 * @param {string} url - The target website URL
 * @returns {Promise<Object>} - The analysis results (domainAge, ssl, blacklist)
 */
export const checkWebsite = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-website`, { url });
    console.log('checkWebsite response:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('checkWebsite error:', error); // Debugging log
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { detail: error.message };
  }
};

/**
 * Utility helper to extract user-friendly error messages.
 */
export const getApiErrorMessage = (error, defaultMessage = 'An error occurred.') => {
  if (typeof error.detail === 'string') {
    return error.detail;
  }
  if (Array.isArray(error.detail)) {
    return error.detail.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
  }
  return defaultMessage;
};