import React, { useEffect, useState, useRef } from "react";
import { VStack, Text, Input, Button, useToast } from "@chakra-ui/react";
import { QuestionType } from "../utils/LevelUtils";
import { translateText } from "../../../common/utils/translate";
import {
  SpeechRecognition,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
} from "../../chat/stt";

interface SpeakingQuestionProps {
  language: string;
  questions: QuestionType[];
  handleAnswer: (questionIndex: number, answer: boolean) => void;
}

const SpeakingQuestion: React.FC<SpeakingQuestionProps> = ({
  language,
  questions,
  handleAnswer,
}) => {
  const [recordedText, setRecordedText] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [isListening, setIsListening] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );
  const [translatedQuestions, setTranslatedQuestions] = useState<string[]>(
    Array(questions.length).fill("")
  );

  const toast = useToast();
  const recognitionRefs = useRef<(SpeechRecognition | null)[]>(
    Array(questions.length).fill(null)
  );

  const languageMap: { [key: string]: string } = {
    KR: "ko-KR",
    EN: "en-US",
    JP: "ja-JP",
    CN: "zh-CN",
  };

  const languageMapd: { [key: string]: string } = {
    KR: "ko",
    EN: "en",
    JP: "ja",
    CN: "zh",
  };

  useEffect(() => {
    const translateAllQuestions = async () => {
      const translated = await Promise.all(
        questions.map((q) => translateText(q.q_content, languageMapd[language]))
      );
      setTranslatedQuestions(translated);
      console.log(languageMapd[language], language);
    };
    translateAllQuestions();
  }, [questions, language]);

  const normalizeText = (text: string): string => {
    let normalized = text
      .replace(/[？。，！？\s]/g, "")
      .replace(/[.,!?]/g, "")
      .replace(/\s+/g, "");

    normalized = normalized.toLowerCase();

    console.log("Normalizing text:", text, "→", normalized);
    return normalized;
  };

  const calculateSimilarity = (a: string, b: string): number => {
    if (!a || !b) return 0;

    const normalizedA = normalizeText(a);
    const normalizedB = normalizeText(b);

    if (!normalizedA || !normalizedB) return 0;

    let matches = 0;
    let total = Math.max(normalizedA.length, normalizedB.length);

    if (normalizedA === normalizedB) return 100;

    const minLength = Math.min(normalizedA.length, normalizedB.length);
    for (let i = 0; i < minLength; i++) {
      if (normalizedA[i] === normalizedB[i]) {
        matches++;
      }
    }

    const similarity = (matches / total) * 100;

    return similarity;
  };

  const cleanupRecognition = (index: number) => {
    try {
      if (recognitionRefs.current[index]) {
        recognitionRefs.current[index]?.stop();
        recognitionRefs.current[index] = null;
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
    setIsListening((prev) => {
      const updatedListening = [...prev];
      updatedListening[index] = false;
      return updatedListening;
    });
  };

  const initializeRecognition = (index: number) => {
    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      toast({
        title: "음성 인식이 지원되지 않는 브라우저입니다",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (recognitionRefs.current[index]) {
      recognitionRefs.current[index]?.removeEventListener("result", () => {});
      recognitionRefs.current[index]?.removeEventListener("error", () => {});
      recognitionRefs.current[index]?.removeEventListener("end", () => {});
      recognitionRefs.current[index] = null;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = languageMap[language] || "en-US";

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;

      setRecordedText((prev) => {
        const updatedText = [...prev];
        updatedText[index] = transcript;
        return updatedText;
      });

      const similarity = calculateSimilarity(
        transcript,
        questions[index].q_content
      );

      const isCorrect = similarity >= 70;

      handleAnswer(index, isCorrect);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event);
      cleanupRecognition(index);
    };

    recognition.onend = () => {
      setIsListening((prev) => {
        const updatedListening = [...prev];
        updatedListening[index] = false;
        return updatedListening;
      });
    };

    recognitionRefs.current[index] = recognition;
  };

  const toggleListening = (index: number) => {
    try {
      if (isListening[index]) {
        cleanupRecognition(index);
      } else {
        cleanupRecognition(index);
        initializeRecognition(index);
        setTimeout(() => {
          recognitionRefs.current[index]?.start();
          setIsListening((prev) => {
            const updatedListening = [...prev];
            updatedListening[index] = true;
            return updatedListening;
          });
        }, 100);
      }
    } catch (error) {
      console.error("Toggle listening error:", error);

      cleanupRecognition(index);
    }
  };

  useEffect(() => {
    return () => {
      recognitionRefs.current.forEach((recognition, index) => {
        if (recognition) {
          cleanupRecognition(index);
        }
      });
    };
  }, []);

  return (
    <VStack spacing={4}>
      {questions.map((_, index) => (
        <VStack key={index} spacing={4} align="stretch" width="100%">
          <Text fontSize="xl" fontWeight="bold">
            말하기 문제 {index + 1}번
          </Text>
          <Text>{translatedQuestions[index]}</Text>
          <Input
            placeholder="STT로 생성된 텍스트가 여기에 표시됩니다"
            value={recordedText[index]}
            isReadOnly
          />
          <Button
            colorScheme="teal"
            minWidth={"500px"}
            onClick={() => toggleListening(index)}
          >
            {isListening[index] ? "Stop STT" : "Start STT"}
          </Button>
        </VStack>
      ))}
    </VStack>
  );
};

export default SpeakingQuestion;
