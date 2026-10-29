const API_BASE_URL = 'http://localhost:8000'; // Update to your API base URL

export const fetchBeginnerQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/beginner`);
    if (!response.ok) {
      throw new Error(`Error fetching quiz questions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Quiz Service Fetch Error:", error);
    throw error;
  }
};

export const fetchIntermediateQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/beginner`);
    if (!response.ok) {
      throw new Error(`Error fetching quiz questions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Quiz Service Fetch Error:", error);
    throw error;
  }
};

export const fetchAdvancedQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/advanced`);
    if (!response.ok) {
      throw new Error(`Error fetching quiz questions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Quiz Service Fetch Error:", error);
    throw error;
  }
};