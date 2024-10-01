import { useState } from "react";
import {
  Box,
  Button,
  Select,
  Text,
  VStack,
  Image,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { default_img } from "../../../common/utils/img";

const MatchingComponent = () => {
  const [isMatched, setIsMatched] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMatchStart = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsMatched(true);
    }, 2000);
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
            랜덤 매칭
          </Text>
          {!isMatched && !isLoading ? (
            <>
              <Select
                placeholder="🌍 국적을 선택하세요"
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
                <option value="KR">🇰🇷 대한민국</option>
                <option value="US">🇺🇸 미국</option>
                <option value="JP">🇯🇵 일본</option>
                <option value="CN">🇨🇳 중국</option>
              </Select>

              <Select
                placeholder="⚖️ 레벨을 선택하세요"
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
                <option value="low">⬇️ 나보다 낮은 사람</option>
                <option value="similar">➡️ 비슷한 사람</option>
                <option value="high">⬆️ 나보다 높은 사람</option>
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
                매칭 시작
              </Button>
            </>
          ) : isLoading ? (
            // 매칭 중일 때 대기 화면
            <>
              <Text fontSize="lg" color="gray.600">
                친구를 찾는 중입니다... 🔍
              </Text>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green.500"
                size="xl"
              />
              <Text fontSize="md" color="gray.500" mt={4}>
                잠시만 기다려 주세요... ⏳
              </Text>
            </>
          ) : (
            // 매칭 완료 화면
            <>
              <Text fontSize="lg" color="blue.700" fontWeight="bold">
                매칭 완료! 🎉
              </Text>
              <Text fontSize="md" color="gray.600">
                선택한 국적:{" "}
                {selectedCountry === "KR"
                  ? "🇰🇷 대한민국"
                  : selectedCountry === "US"
                  ? "🇺🇸 미국"
                  : selectedCountry === "JP"
                  ? "🇯🇵 일본"
                  : "🇨🇳 중국"}
              </Text>
              <Text fontSize="md" color="gray.600">
                선택한 레벨:{" "}
                {selectedLevel === "low"
                  ? "나보다 낮은 사람 ⬇️"
                  : selectedLevel === "similar"
                  ? "➡️ 비슷한 사람"
                  : "나보다 높은 사람 ⬆️"}
              </Text>
              <Text fontSize="md" color="gray.600">
                매칭된 상대: John Doe
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
                다시 매칭하기
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default MatchingComponent;
