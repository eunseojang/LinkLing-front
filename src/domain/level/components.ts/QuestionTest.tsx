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

interface QuestionTestProps {
  langInfo: UserLanguage;
}

function QuestionTest({ langInfo }: QuestionTestProps) {
  const [currentType, setCurrentType] = useState<ProblemType>("L");
  const [questions, setQuestions] = useState<{ [key: string]: QuestionType[] }>(
    {}
  );

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [answers, setAnswers] = useState<{ [key: string]: boolean[] }>({
    L: [],
    S: [],
    R: [],
    W: [],
  });
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const  OPENAI_API_KEY = import.meta.env. VITE_OPENAI_API_KEY;

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
        const updatedAnswers = { ...prev };
        updatedAnswers[currentType][questionIndex] = isCorrect;
        return updatedAnswers;
      });
    }

    if (currentQuestion.q_answer === 0) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.q_content]: selectedAnswer,
      });
    }
  };

  const handleAnswerSpeaking = (
    questionIndex: number,
    selectedAnswer: boolean
  ) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      updatedAnswers[currentType][questionIndex] = selectedAnswer;
      return updatedAnswers;
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

  const gradeQuestion = async (question: any) => {
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
                content: `Question: ${question.question}\nStudent's Answer: ${question.q_answer}`,
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
      const gradingPromises = questions["W"].map((question) =>
        gradeQuestion(question)
      );
      const results = await Promise.all(gradingPromises);

      setAnswers((prev) => ({
        ...prev,
        W: results,
      }));
    } catch (error) {
      console.error("Grading failed:", error);
      alert("채점 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setShowResults(true);
    }
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
                setUserAnswers({
                  ...userAnswers,
                  [questions["W"][index].q_content]: answer,
                })
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
      )}
    </VStack>
  );
}

export default QuestionTest;
