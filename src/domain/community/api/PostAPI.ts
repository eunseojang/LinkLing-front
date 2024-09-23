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

export const registerPost = async (post_img: string, post_detail: string) => {
  try {
    const response = await axiosInstance.post(`/post`, {
      post_img,
      post_detail,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
