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
import { useTranslation } from "react-i18next";

const MatchingComponent = () => {
  const { t } = useTranslation();
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
                <option value="low">{"⬇️" + t(`matching.lower`)}</option>
                <option value="ignore">{t(`matching.ignore`)}</option>
                <option value="high">{"⬆️" + t(`matching.upper`)}</option>
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
                {selectedLevel === "low"
                  ? t(`matching.lower`) + "⬇️"
                  : selectedLevel === "ignore"
                  ? t(`matching.ignore`)
                  : t(`matching.upper`) + "⬆️"}
              </Text>
              <Text fontSize="md" color="gray.600">
                {t(`matching.opponent`)}: John Doe
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
