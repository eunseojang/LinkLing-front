import axiosInstance from "../../../../common/api/axiosInstance";

//입력한 이메일로 코드 전송
export const resetPasswordAuth = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/reset-password-auth`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

//이메일로 임시 비밀전호 발성
export const resetPassword = async (email: string, token: string) => {
  try {
    const response = await axiosInstance.post(`/reset-password`, {
      email,
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
