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

//친추 승인 거절
export const confirmFriend = async (target_id: string, confirm: boolean) => {
  try {
    const response = await axiosInstance.post(`/confirm-friend`, {
      target_id,
      confirm,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};