import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends text to the phishing prediction API and returns the response.
 * @param {string} textToPredict - The text input to be analyzed.
 * @returns {Promise<Object>} The API response data.
 */
export const predictPhishing = async (textToPredict) => {
  const response = await api.post(
    import.meta.env.VITE_PREDICT_PATH || '/predict',
    { text: textToPredict.trim() },
  );

  return response.data;
};

/**
 * Sends a URL to the backend website inspection endpoint.
 * @param {string} url - The website URL to inspect.
 * @returns {Promise<Object>} The API response data.
 */
export const checkWebsite = async (url) => {
  const response = await api.post(
    import.meta.env.VITE_WEBSITE_CHECK_PATH || '/check-url',
    { url: url.trim() },
  );

  return response.data;
};

export const getApiErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === 'ECONNABORTED') return 'The backend took too long to respond.';
  if (!error.response) return 'Unable to reach the backend. Check that it is running.';
  return fallback;
};