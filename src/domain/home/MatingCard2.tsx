import { Flex, Box, Heading, Text } from "@chakra-ui/react";

interface MatchingCardProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const MatchingCard2 = ({ icon, heading, description }: MatchingCardProps) => {
  return (
    <Flex
      textAlign="center"
      padding="50px"
      backgroundColor="white"
      borderRadius="20px"
      alignItems={"center"}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      flex="1"
      maxWidth={{ base: "1000px", md: "1000px" }}
      mb={{ base: "20px", md: "30px" }}
      transition="transform 0.3s ease"
      _hover={{
        transform: "scale(1.03)",
      }}
    >
      <Box fontSize="80px" width={"300px"}>
        {icon}
      </Box>
      <Flex flexDirection={"column"} textAlign={"left"} ml={5}>
        <Heading fontSize="3xl" mb="20px" color={"#73DA95"}>
          {heading}
        </Heading>
        <Text color={"customBlack"}>{description}</Text>
      </Flex>
    </Flex>
  );
};
export default MatchingCard2;
