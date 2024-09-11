import { useState } from "react";
import {
  Box,
  Button,
  Select,
  Text,
  VStack,
  Image,
  Center,
} from "@chakra-ui/react";
import { default_img } from "../../../common/utils/img";

const MatchingComponent = () => {
  const [isMatched, setIsMatched] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleMatchStart = () => {
    setIsMatched(true);
  };

  const handleRematch = () => {
    setIsMatched(false);
  };

  return (
    <Box p={10} m={10}>
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        maxW="sm"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Center>
            <Image
              borderRadius="full"
              boxSize="80px"
              src={default_img}
              alt="Profile Placeholder"
              border="2px solid"
              borderColor="green.500"
              mb={2}
            />
          </Center>
          <Text fontSize="2xl" fontWeight="extrabold">
            상대찾기
          </Text>
          {!isMatched ? (
            <>
              <Select
                placeholder="국적을 선택하세요"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                borderColor="green.500"
                focusBorderColor="green.700"
                _hover={{ borderColor: "green.300" }}
                size="lg"
                fontSize="md"
                color="gray.700"
              >
                <option value="KR">대한민국</option>
                <option value="US">미국</option>
                <option value="JP">일본</option>
                <option value="CN">중국</option>
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
          ) : (
            <>
              <Text fontSize="lg" color="blue.700" fontWeight="bold">
                매칭 완료!
              </Text>
              <Text fontSize="md" color="gray.600">
                선택한 국적: {selectedCountry}
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
