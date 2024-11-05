import React from "react";
import { VStack, Text, Textarea } from "@chakra-ui/react";
import { QuestionType } from "../utils/LevelUtils";

interface WritingQuestionProps {
  questions: QuestionType[];
  handleAnswer: (questionIndex: number, answer: string) => void;
}

const WritingQuestion: React.FC<WritingQuestionProps> = ({
  questions,
  handleAnswer,
}) => (
  <VStack spacing={4}>
    {questions.map((question, index) => (
      <VStack key={index} spacing={4} align="stretch" width="100%">
        <Text fontSize="xl" fontWeight="bold">
          쓰기 문제 {index + 1}번
        </Text>
        <Text>{question.q_content}</Text>
        <Textarea
          width={"500px"}
          placeholder="답변을 입력하세요"
          onChange={(e) => handleAnswer(index, e.target.value)}
        />
      </VStack>
    ))}
  </VStack>
);

export default WritingQuestion;
