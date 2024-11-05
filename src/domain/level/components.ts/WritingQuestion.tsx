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
    <Text color={"red"} mb={3}>
      주어진 질문에 대해서 답변하세요.
    </Text>
    {questions.map((question, index) => (
      <VStack
        key={index}
        spacing={4}
        align="stretch"
        width="100%"
        justifyContent={"center"}
      >
        <Text fontSize="xl" fontWeight="bold">
          쓰기 문제 {index + 1}번
        </Text>
        <Text maxWidth={"400px"}>{question.q_content}</Text>
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
