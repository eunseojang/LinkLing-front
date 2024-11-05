import { getQuestion, getQuestionSpeaking } from "../api/TestAPI";
import { QuestionType, Language, ProblemType } from "./LevelUtils";

export async function getQuestionsForLevel(
  language: Language,
  level: number
): Promise<{ [key: string]: QuestionType[] }> {
  const questions: { [key in ProblemType]?: QuestionType[] } = {};

  try {
    // Listening (L) 문제 가져오기
    const listeningQuestions = await getQuestion("L", language, level);
    questions["L"] = listeningQuestions;

    // Speaking (S) 문제 가져오기 - 주관식
    const speakingQuestions = await getQuestionSpeaking(language, level);
    questions["S"] = speakingQuestions;

    // Reading (R) 문제 가져오기
    const readingQuestions = await getQuestion("R", language, level);
    questions["R"] = readingQuestions;

    // Writing (W) 문제 가져오기 - 주관식
    const writingQuestions = await getQuestion("W", language, level);
    questions["W"] = writingQuestions;

    return questions as { [key: string]: QuestionType[] };
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error;
  }
}
