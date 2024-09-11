import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const checkEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/check-email`,
      { email },
      { headers: { "ngrok-skip-browser-warning": "69420" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const verifyEmail = async (email: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/verify-email`,
      {
        email,
        token,
      },
      { headers: { "ngrok-skip-browser-warning": "69420" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
