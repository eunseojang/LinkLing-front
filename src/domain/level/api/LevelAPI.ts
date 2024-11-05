import axiosInstance from "../../../common/api/axiosInstance";
import { getNicknameToken } from "../../../common/utils/nickname";
import { UserLanguage } from "../utils/LevelUtils";

export const getLevel = async () => {
  try {
    const nickName = getNicknameToken();
    const response = await axiosInstance.get(`lang/${nickName}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const postLevel = async (data: UserLanguage) => {
  try {
    const nickName = getNicknameToken();
    const response = await axiosInstance.post(`lang/${nickName}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
