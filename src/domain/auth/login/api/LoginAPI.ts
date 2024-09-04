import axios from "axios";
import { useToastMessage } from "../../../../common/components/useToastMessage";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useLoginUser = () => {
  const { showToast } = useToastMessage();
  const loginUser = async (credentials: {
    id: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        user_id: credentials.id,
        user_pw: credentials.password,
        remeber_me: credentials.rememberMe,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.code === 4010203) {
          showToast(`login.failTitle`, `login.loginError`, "error");
        } else {
          showToast(`login.failTitle`, `login.error`, "error");
        }
      } else {
        showToast(`login.failTitle`, `login.error`, "error");
      }
    }
  };

  return { loginUser };
};

export const findePassword = async (id: string, email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/find-password`, {
      user_id: id,
      use_email: email,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
