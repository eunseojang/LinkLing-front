import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  Text,
  VStack,
  Image,
  Center,
  Spinner,
  Tab,
} from "@chakra-ui/react";
import { default_img } from "../../../common/utils/img";
import { useTranslation } from "react-i18next";
import { getNicknameToken } from "../../../common/utils/nickname";

interface MatchData {
  userId: string;
  preferredNation: string;
  isMatching: boolean;
  language: string;
  levelRange: "EQUAL" | "HIGH" | "LOW" | "IGNORE";
}

interface MatchedUser {
  userId: string;
  userName: string;
  userProfile: string;
  userNation: string;
  matchType: "EQUAL_LEVEL";
  languageLevels: { language: string; level: number }[];
}

const MatchingComponent: React.FC = () => {
  const { t } = useTranslation();
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://unbiased-evenly-worm.ngrok-free.app/matching?userId=" +
        getNicknameToken()
    );

    socket.onopen = () => {
      console.log("WebSocket matching 연결됨!");
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response);
      if (response.success) {
        setIsMatched(true);
        setMatchedUser(response.matchedUser);
        setIsLoading(false);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket 오류:", error);
      setIsLoading(false);
    };

    socket.onclose = () => {
      console.log("WebSocket 연결 종료됨!");
    };

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleMatchStart = () => {
    setIsLoading(true);

    if (ws && ws.readyState === WebSocket.OPEN) {
      const matchData: MatchData = {
        userId: getNicknameToken(),
        preferredNation: selectedCountry,
        isMatching: true,
        language: "KR",
        levelRange: selectedLevel as "EQUAL" | "HIGH" | "LOW" | "IGNORE",
      };

      ws.send(JSON.stringify(matchData));
      console.log("매칭 데이터 전송:", matchData);
    } else {
      console.error("WebSocket이 열리지 않았습니다.");
      setIsLoading(false);
    }
  };

  const handleRematch = () => {
    setIsMatched(false);
    setSelectedCountry("");
    setSelectedLevel("");
   
  };

  return (
    <Box mr={10}>
      <Box
        bg="white"
        p={10}
        borderRadius="xl"
        boxShadow="md"
        w="500px"
        h={"550px"}
        textAlign="center"
      >
        <VStack spacing={5}>
          <Center>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={default_img}
              alt="Profile Placeholder"
              border="2px solid"
              borderColor="green.500"
            />
          </Center>
          <Text fontSize="2xl" fontWeight="extrabold">
            {t(`friend.matching`)}
          </Text>
          {!isMatched && !isLoading ? (
            <>
              <Select
                placeholder={"🌍" + t(`matching.selectNation`)}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                borderColor="green.500"
                focusBorderColor="green.700"
                _hover={{ borderColor: "green.300" }}
                size="lg"
                fontSize="md"
                color="gray.700"
                mt={3}
              >
                <option value="KR">🇰🇷 {t(`country.kr`)}</option>
                <option value="US">🇺🇸 {t(`country.us`)}</option>
                <option value="JP">🇯🇵 {t(`country.jp`)}</option>
                <option value="CN">🇨🇳 {t(`country.cn`)}</option>
              </Select>

              <Select
                placeholder={"⚖️" + t(`matching.seclectLevel`)}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                borderColor="green.500"
                focusBorderColor="green.700"
                _hover={{ borderColor: "green.300" }}
                size="lg"
                fontSize="md"
                color="gray.700"
                mt={4}
              >
                <option value="LOW">{"⬇️" + t(`matching.lower`)}</option>
                <option value="IGNORE">{t(`matching.ignore`)}</option>
                <option value="EQUAL">{t(`matching.equal`)}</option>
                <option value="HIGH">{"⬆️" + t(`matching.upper`)}</option>
              </Select>

              <Button
                colorScheme="teal"
                onClick={handleMatchStart}
                w="full"
                size="lg"
                fontSize="md"
                mt={4}
                bgGradient="linear(to-r, #73DA95, green.500)"
                _hover={{
                  bgGradient: "linear(to-r,  #73DA95, green.600)",
                }}
              >
                {t(`matching.start`)}
              </Button>
            </>
          ) : isLoading ? (
            <>
              <Text fontSize="lg" color="gray.600">
                {t(`matching.loading`)}... 🔍
              </Text>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green.500"
                size="xl"
              />
              <Text fontSize="md" color="gray.500" mt={4}>
                {t(`matching.waiting`)}... ⏳
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="lg" color="blue.700" fontWeight="bold">
                {t(`matching.success`)}! 🎉
              </Text>
              <Text fontSize="md" color="gray.600">
                {t(`matching.selectedNation`)}:{" "}
                {selectedCountry === "KR"
                  ? "🇰🇷 " + t(`country.kr`)
                  : selectedCountry === "US"
                  ? "🇺🇸 " + t(`country.us`)
                  : selectedCountry === "JP"
                  ? "🇯🇵 " + t(`country.jp`)
                  : "🇨🇳 " + t(`country.cn`)}
              </Text>
              <Text fontSize="md" color="gray.600">
                {t(`matching.selectedLevel`)}:{" "}
                {selectedLevel === "LOW"
                  ? t(`matching.lower`) + "⬇️"
                  : selectedLevel === "IGNORE"
                  ? t(`matching.ignore`)
                  :selectedLevel === "HIGH"? t(`matching.upper`) + "⬆️" : "동등한 레벨"}
              </Text>
              <Text fontSize="md" color="gray.600">
                {t(`matching.opponent`)}: {matchedUser?.userName || "John Doe"}
              </Text>
              <Button
                colorScheme="teal"
                onClick={handleRematch}
                w="full"
                size="lg"
                fontSize="md"
                mt={4}
                bgGradient="linear(to-r, #73DA95, green.500)"
                _hover={{
                  bgGradient: "linear(to-r,  #73DA95, green.600)",
                }}
              >
                {t(`matching.re`)}
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default MatchingComponent;
