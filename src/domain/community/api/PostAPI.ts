import axiosInstance from "../../../common/api/axiosInstance";

export const getPost = async (page: number) => {
  try {
    const response = await axiosInstance.get(`/post?size=10&page=${page}`);
    return response.data.content;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const registerPost = async (
  file: File | null,
  postData: { post_detail: string }
) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("postData", JSON.stringify(postData));

  try {
    const response = await axiosInstance.post(`/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
