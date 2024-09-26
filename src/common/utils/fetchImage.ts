import axiosInstance from "../api/axiosInstance";

export const fetcheImage = async (name: string) => {
  try {
    const filename = name.replace("http://localhost:8080", "");

    const response = await axiosInstance.get(`image`, {
      params: { name: filename },
      responseType: "blob",
    });

    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (err) {
    return null;
  }
};
