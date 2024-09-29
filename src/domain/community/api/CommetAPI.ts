import axiosInstance from "../../../common/api/axiosInstance";

export const postComment = async (post_id: number, comment_detail: string) => {
  try {
    const response = await axiosInstance.post(`/comment/${post_id}`, {
      comment_detail,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const getComment = async (
  post_id: number,
  size: number,
  page: number
) => {
  try {
    const response = await axiosInstance.get(
      `/comment/${post_id}?size=${size}&page=${page}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const putComment = async (
  comment_id: number,
  comment_detail: string
) => {
  try {
    const response = await axiosInstance.put(`/comment/${comment_id}`, {
      comment_detail,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const deleteComment = async (comment_id: number) => {
  try {
    const response = await axiosInstance.delete(`/comment/${comment_id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
