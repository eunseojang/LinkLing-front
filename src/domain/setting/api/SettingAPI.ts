import axiosInstance from "../../../common/api/axiosInstance";

export const resetID = async (id: string, new_id: string) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}/id`, { new_id });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const resetPassword = async (
  id: string,
  curr_pw: string,
  new_pw: string
) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}/password`, {
      curr_pw,
      new_pw,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
  profileData: {
    user_name: string;
    user_info: string;
    user_gender: string;
    user_nation: string;
  }
): Promise<any> => {
  const formData = new FormData();
  formData.append("profileData", JSON.stringify(profileData));

  try {
    const response = await axiosInstance.put(`/profile/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending post request:", error);
    throw error;
  }
};
