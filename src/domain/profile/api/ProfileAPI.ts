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
  file: File | null,
  profileData: {
    user_name: string;
    user_info: string;
    user_gender: string;
    user_nation: string;
  }
): Promise<any> => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

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
