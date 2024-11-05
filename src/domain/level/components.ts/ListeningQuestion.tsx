import React, { useState } from "react";
import { VStack, Button, Text } from "@chakra-ui/react";
import { QuestionType } from "../utils/LevelUtils";

interface ListeningQuestionProps {
  language: string;
  questions: QuestionType[];
  handleAnswer: (questionIndex: number, answer: number) => void;
}

const ListeningQuestion: React.FC<ListeningQuestionProps> = ({
  language,
  questions,
  handleAnswer,
}) => {
  // 선택된 답변을 저장하는 상태
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});

  const languageMap: { [key: string]: string } = {
    KO: "ko-KR",
    EN: "en-US",
    JA: "ja-JP",
    CN: "zh-CN",
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language];

    utterance.onend = () => console.log("발음이 완료되었습니다.");

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const playQuestionAudio = (question: QuestionType) => {
    if (question.q_script) speakText(question.q_script);
    speakText(question.q_content);
  };

  const handleButtonClick = (questionIndex: number, choiceIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: choiceIndex,
    }));
    handleAnswer(questionIndex, choiceIndex);
  };

  return (
    <VStack spacing={4}>
      {questions.map((question, index) => (
        <VStack key={index} spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            듣기 문제 {index + 1}번
          </Text>
          <Button
            onClick={() => playQuestionAudio(question)}
            colorScheme="teal"
          >
            재생하기
          </Button>
          {[
            question.q_choice1,
            question.q_choice2,
            question.q_choice3,
            question.q_choice4,
          ].map((choice, choiceIndex) => (
            <Button
              minWidth={"400px"}
              key={choiceIndex}
              onClick={() => handleButtonClick(index, choiceIndex + 1)}
              colorScheme={
                selectedAnswers[index] === choiceIndex + 1 ? "blue" : "gray"
              }
              variant={
                selectedAnswers[index] === choiceIndex + 1 ? "solid" : "outline"
              }
            >
              {choice}
            </Button>
          ))}
        </VStack>
      ))}
    </VStack>
  );
};

export default ListeningQuestion;
