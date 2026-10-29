import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Uploads an image file to the FastAPI backend for OCR text extraction.
 * @param {File} imageFile - The image file object selected by the user
 * @returns {Promise<Object>} - Contains filename and extracted_text
 */
export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/scan-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { detail: error.message };
  }
};