import axiosInstance from "../../../common/api/axiosInstance";

export const requestFriend = async (target_id: string) => {
  try {
    const response = await axiosInstance.post(`/request-friend`, {
      target_id,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const confirmFriend = async (confirm: boolean) => {
  try {
    const response = await axiosInstance.post(`/confirm-friend`, {
      confirm,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
