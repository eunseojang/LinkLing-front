import axiosInstance from "../../../common/api/axiosInstance";

export const getProfile = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/profile/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const putProfile = async (
  id: string,
  user_profile: string,
  user_name: string,
  user_info: string,
  user_gender: string,
  user_nation: string
) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}`, {
      user_profile,
      user_name,
      user_info,
      user_gender,
      user_nation,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
