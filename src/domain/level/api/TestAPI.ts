import axiosInstance from "../../../common/api/axiosInstance";
import { Language, ProblemType } from "../utils/LevelUtils";

export const getQuestion = async (
  type: ProblemType,
  language: Language,
  level: number
) => {
  try {
    const response = await axiosInstance.get(
      `question/get?type=${type}&language=${language}&level=${level + 1}`
    );
    return response.data.data.questions;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const getQuestionSpeaking = async (
  language: Language,
  level: number
) => {
  try {
    const response = await axiosInstance.get(
      `question/get?language=${language}&level=${level + 1}`
    );
    return response.data.data.questions;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
