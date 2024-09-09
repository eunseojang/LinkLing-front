import { Flex, Box, Heading, Text } from "@chakra-ui/react";

interface MatchingCardProps {
  icon: React.ReactNode; // 아이콘을 Node로 받을 수 있게 설정
  heading: string;
  description: string;
}

const MatchingCard = ({ icon, heading, description }: MatchingCardProps) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"} // 세로로 가운데 정렬
      textAlign="center"
      padding="20px"
      backgroundColor="white"
      borderRadius="20px"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      flex="1"
      maxWidth={{ base: "100%", md: "30%" }}
      mb={{ base: "20px", md: "0" }}
      h={"300px"}
      flexDirection={"column"}
      transition="transform 0.3s ease" // 애니메이션 효과 설정
      _hover={{
        transform: "scale(1.05)", // 호버 시 약간 확대
      }}
    >
      <Box fontSize="50px" mb="20px">
        {icon}
      </Box>
      <Heading fontSize="2xl" mb="20px" color={"#73DA95"}>
        {heading}
      </Heading>
      <Text>{description}</Text>
    </Flex>
  );
};

export default MatchingCard;
