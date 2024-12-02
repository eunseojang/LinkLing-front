import axiosInstance from "./axiosInstance";

export const getAlarm = async () => {
  try {
    const response = await axiosInstance.get(`/notification/get`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const alarmCheck = async (notification_id: number) => {
  try {
    const response = await axiosInstance.put(
      `/notification/check/${notification_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
