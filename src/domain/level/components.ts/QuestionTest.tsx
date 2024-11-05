import { useState, useEffect } from "react";
import {
  VStack,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from "@chakra-ui/react";
import ListeningQuestion from "./ListeningQuestion";
import SpeakingQuestion from "./SpeakingQuestion";
import ReadingQuestion from "./ReadingQuestion";
import WritingQuestion from "./WritingQuestion";
import { getQuestionsForLevel } from "../utils/getQuestionsForLevel";
import { UserLanguage, ProblemType, QuestionType } from "../utils/LevelUtils";
import { updateUserLevel } from "../api/LevelAPI";

interface QuestionTestProps {
  langInfo: UserLanguage;
  setSelectedLang: any;
}

function QuestionTest({ langInfo, setSelectedLang }: QuestionTestProps) {
  const [currentType, setCurrentType] = useState<ProblemType>("L");
  const [questions, setQuestions] = useState<{ [key: string]: QuestionType[] }>(
    {}
  );
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [answers, setAnswers] = useState<{ [key: string]: boolean[] }>({
    L: [],
    S: [],
    R: [],
    W: [],
  });
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [total, setTotal] = useState<number>(0);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const fetchedQuestions = await getQuestionsForLevel(
          langInfo.user_lang,
          langInfo.lang_level
        );
        setQuestions(fetchedQuestions);
        setAnswers({
          L: Array(fetchedQuestions.L?.length || 0).fill(null),
          S: Array(fetchedQuestions.S?.length || 0).fill(null),
          R: Array(fetchedQuestions.R?.length || 0).fill(null),
          W: Array(fetchedQuestions.W?.length || 0).fill(null),
        });
      } catch (error) {
        console.error("Failed to load questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [langInfo]);

  const handleAnswer = (questionIndex: number, selectedAnswer: any) => {
    const currentQuestion: QuestionType = questions[currentType][questionIndex];

    if (currentQuestion.q_answer !== 0) {
      const isCorrect =
        currentQuestion.q_answer !== undefined &&
        selectedAnswer === currentQuestion.q_answer;

      setAnswers((prev) => {
        const updatedAnswers = [...prev[currentType]];
        updatedAnswers[questionIndex] = isCorrect;
        return { ...prev, [currentType]: updatedAnswers };
      });
    }

    if (currentQuestion.q_answer === 0) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentType + questionIndex]: selectedAnswer, // key를 변경하여 질문의 고유성을 보장
      }));
    }
  };

  const handleAnswerSpeaking = (
    questionIndex: number,
    selectedAnswer: boolean
  ) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev[currentType]];
      updatedAnswers[questionIndex] = selectedAnswer;
      return { ...prev, [currentType]: updatedAnswers };
    });
  };

  const goToNextType = () => {
    const typeOrder: ProblemType[] = ["L", "S", "R", "W"];
    const nextTypeIndex = typeOrder.indexOf(currentType) + 1;

    if (nextTypeIndex < typeOrder.length) {
      setCurrentType(typeOrder[nextTypeIndex]);
    } else {
      handleAnswerFinal();
    }
  };

  const gradeQuestion = async (question: string, userAnswer: string) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are evaluating student responses. First, detect the language of the question.

                Evaluate the answer based on these criteria:
                Return true if:
                - The answer shows understanding of the concept
                - The main idea is correct even if details vary
                - The response is logically sound
                - Grammar or spelling mistakes don't matter if meaning is clear

                Return false if:
                - The answer is completely wrong
                - The response shows no understanding
                - The answer is off-topic
                - The answer is in a different language than the question

                IMPORTANT: Always respond with ONLY 'true' or 'false' regardless of the question's language.
                Do not use language-specific responses like '정답', '正确', or '正解'.
                Only 'true' or 'false' are acceptable responses.`,
              },
              {
                role: "user",
                content: `Question: ${question}\nStudent's Answer: ${userAnswer}`,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const result = data.choices[0].message.content.trim().toLowerCase();

      // 오직 'true' 또는 'false' 문자열만 처리
      return result === "true";
    } catch (error) {
      console.error("Error grading question:", error);
      return false;
    }
  };

  const handleAnswerFinal = async () => {
    setLoading(true);

    try {
      const gradingPromises = questions["W"].map((question, index) =>
        gradeQuestion(question.q_content, userAnswers[currentType + index])
      );
      const results = await Promise.all(gradingPromises);

      setAnswers((prev) => ({
        ...prev,
        W: results,
      }));

      const trueCountWriting = results.filter(
        (result) => result === true
      ).length;

      // 각 타입의 정답(true) 개수를 세는 부분 추가
      const totalTrueCount = Object.keys(answers).reduce((count, type) => {
        return count + answers[type].filter((result) => result === true).length;
      }, 0);

      // 최종 true 개수 합산
      const total = trueCountWriting + totalTrueCount;
      setTotal(total);
      if (total >= 15) {
        updateUserLevel(langInfo.user_lang);
      }
      console.log("총 true 개수:", total);
    } catch (error) {
      console.error("Grading failed:", error);
      alert("채점 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

  const restart = () => {
    setSelectedLang(null);
    setShowResults(false);
  };
  if (loading) return <Text>Loading questions...</Text>;

  return (
    <VStack spacing={4}>
      {!showResults && (
        <>
          {currentType === "L" && questions["L"] && (
            <ListeningQuestion
              language={langInfo.user_lang}
              questions={questions["L"]}
              handleAnswer={handleAnswer}
            />
          )}
          {currentType === "S" && questions["S"] && (
            <SpeakingQuestion
              language={langInfo.user_lang}
              questions={questions["S"]}
              handleAnswer={handleAnswerSpeaking}
            />
          )}
          {currentType === "R" && questions["R"] && (
            <ReadingQuestion
              questions={questions["R"]}
              handleAnswer={handleAnswer}
            />
          )}
          {currentType === "W" && questions["W"] && (
            <WritingQuestion
              questions={questions["W"]}
              handleAnswer={(index, answer) =>
                setUserAnswers((prev) => ({
                  ...prev,
                  [currentType + index]: answer,
                }))
              }
            />
          )}
          <Button
            colorScheme="teal"
            onClick={currentType !== "W" ? goToNextType : handleAnswerFinal}
            mb={3}
          >
            {currentType === "W" ? "Submit" : "Next Type"}
          </Button>
        </>
      )}

      {showResults && (
        <>
          <HStack spacing={8}>
            {Object.keys(questions).map((type) => (
              <VStack key={type} spacing={2} align="stretch" width="100%">
                <Text fontSize="lg" fontWeight="bold" ml={6}>
                  {type === "L"
                    ? "Listening"
                    : type === "S"
                    ? "Speaking"
                    : type === "R"
                    ? "Reading"
                    : "Writing"}
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Question</Th>
                      <Th>Result</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {answers[type].slice(0, 5).map((isCorrect, index) => (
                      <Tr key={`${type}-${index}`}>
                        <Td>{index + 1}</Td>
                        <Td>{isCorrect ? "O" : "X"}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            ))}
          </HStack>
          <Text>{total}/20</Text>
          <Text>
            {total >= 15
              ? "축하합니다. 레벨업했습니다."
              : "15점 이하로 레벨업에 실패했습니다."}
          </Text>
          <Button onClick={restart}>다시 레벨테스트 보러가기</Button>
        </>
      )}
    </VStack>
  );
}

export default QuestionTest;
