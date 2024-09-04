import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const register = async (
  id: string,
  email: string,
  nickName: string,
  gender: string,
  nation: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      user_id: id,
      user_email: email,
      user_name: nickName,
      user_gender: gender,
      user_nation: nation,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const verifyId = async (id: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-id`, {
      user_id: id,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
