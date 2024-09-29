import axiosInstance from "../../../common/api/axiosInstance";

export const getPost = async (nickname: string, page: number) => {
  try {
    const response = await axiosInstance.get(
      `/post/${nickname}?size=10&page=${page}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
