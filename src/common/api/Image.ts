import axiosInstance from "./axiosInstance";

export const uploadImage = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
