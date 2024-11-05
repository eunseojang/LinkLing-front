import React, { useState } from "react";
import { VStack, Button, Text } from "@chakra-ui/react";
import { QuestionType } from "../utils/LevelUtils";

interface ReadingQuestionProps {
  questions: QuestionType[];
  handleAnswer: (questionIndex: number, answer: number) => void;
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
  questions,
  handleAnswer,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleChoiceClick = (questionIndex: number, choiceIndex: number) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[questionIndex] = choiceIndex;
      return updatedAnswers;
    });
    handleAnswer(questionIndex, choiceIndex);
  };

  return (
    <VStack spacing={4}>
      {questions.map((question, index) => (
        <VStack key={index} spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            읽기 문제 {index + 1}번
          </Text>
          <Text>{question.q_script}</Text>
          <Text>{question.q_content}</Text>
          {[
            question.q_choice1,
            question.q_choice2,
            question.q_choice3,
            question.q_choice4,
          ].map((choice, choiceIndex) => (
            <Button
              width={"400px"}
              key={choiceIndex}
              onClick={() => handleChoiceClick(index, choiceIndex + 1)}
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

export default ReadingQuestion;
