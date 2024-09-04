import axiosInstance from "../../../common/api/axiosInstance";

//아이디 변경
export const resetID = async (id: string, new_id: string) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}/id`, { new_id });
    return response.data; //accesToken과 refreshToken이 담겨있음 localstorage에 담아야함
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const resetPassword = async (id: string, new_pw: string) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}/password`, {
      new_pw,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

//성별만 국적만 사용할 예정 PlaceHolder
export const getProfile = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

//성별만 국적만 수정할 예정 but API에서는 다 보내줘야함
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
