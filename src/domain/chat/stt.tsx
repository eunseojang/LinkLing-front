import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Select,
  Text,
  Heading,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const SpeechRecognitionImpl =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognitionImpl) {
  throw new Error("Speech recognition is not supported in this browser.");
}

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [language, setLanguage] = useState("ko-KR");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
      console.log(transcript);
    }

    setText((prev) => prev + finalTranscript);
    setInterimText(interimTranscript);
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  }, [isListening]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = handleResult;
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [handleResult, isListening]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.lang = event.target.value;
      recognitionRef.current.start();
    }
  };

  return (
    <Box
      p={6}
      bgGradient="linear(to-r, blue.400, indigo.500, purple.600)"
      color="white"
      rounded="lg"
      shadow="lg"
    >
      <Heading as="h2" size="xl" mb={4}>
        음성 인식
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="language-select">
          <FormLabel fontWeight="bold">언어 선택:</FormLabel>
          <Select
            value={language}
            onChange={handleLanguageChange}
            bg="white"
            color="black"
          >
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
            <option value="zh-CN">중국어 (간체)</option>
          </Select>
        </FormControl>

        <Button
          onClick={toggleListening}
          colorScheme={isListening ? "red" : "blue"}
          size="lg"
          width="full"
          transform={isListening ? "scale(1.05)" : "scale(1)"}
          transition="all 0.2s"
        >
          {isListening ? "음성 인식 중지" : "음성 인식 시작"}
        </Button>

        {isListening && (
          <Box textAlign="center">
            <Spinner size="xl" />
          </Box>
        )}

        <Box
          mt={4}
          p={3}
          bg="white"
          color="black"
          rounded="md"
          border="1px"
          borderColor="gray.300"
          minH="150px"
        >
          <Text>{text}</Text>
          <Text color="gray.500">{interimText}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SpeechToText;
