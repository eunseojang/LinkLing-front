import axiosInstance from "../../../common/api/axiosInstance";
import { getNicknameToken } from "../../../common/utils/nickname";
import { Language, UserLanguage } from "../utils/LevelUtils";

// UserLanguage 배열을 반환하도록 수정
export const getLevel = async (): Promise<UserLanguage[] | null> => {
  try {
    const nickName = getNicknameToken();
    const response = await axiosInstance.get(`lang/${nickName}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch level:", error);
    return null; // 레벨이 없을 경우 null 반환
  }
};

// UserLanguage 배열을 받아 PUT 요청으로 변경
export const postLevel = async (data: UserLanguage[]) => {
  try {
    const nickName = getNicknameToken();
    const response = await axiosInstance.post(`lang/${nickName}`, data); // PUT 요청으로 변경
    return response.data.data;
  } catch (error) {
    console.error("Failed to update level:", error);
    throw error;
  }
};

// 언어 레벨을 업데이트하는 함수
export const updateUserLevel = async (language: Language) => {
  try {
    let levels = await getLevel();

    // 기존 레벨 데이터가 없으면 빈 배열로 초기화
    if (!levels) {
      levels = [];
    }

    // 해당 언어에 대한 레벨이 존재하는지 확인
    const userLevel = levels.find((level) => level.user_lang === language);

    if (userLevel) {
      let level: number = userLevel.lang_level + 1;
      userLevel.lang_level = level;
    } else {
      // 언어 레벨이 없으면 새로운 레벨로 추가
      levels.push({ user_lang: language, lang_level: 1 });
    }

    // 업데이트된 레벨 리스트를 PUT 요청으로 전송
    await postLevel(levels);
  } catch (error) {
    console.error("Failed to update user level:", error);
  }
};
