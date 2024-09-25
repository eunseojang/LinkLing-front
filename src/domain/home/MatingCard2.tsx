import { Flex, Box, Heading, Text, useBreakpointValue } from "@chakra-ui/react";

interface MatchingCardProps {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const MatchingCard2 = ({ icon, heading, description }: MatchingCardProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      flexDirection={isMobile ? "column" : "row"}
      textAlign="center"
      padding="30px"
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
      <Box
        fontSize={isMobile ? "50px" : "80px"}
        width={isMobile ? "100px" : "150px"}
      >
        {icon}
      </Box>
      <Flex flexDirection={"column"} textAlign={"left"} ml={5}>
        <Heading fontSize="2xl" mb="20px" color={"#73DA95"}>
          {heading}
        </Heading>
        <Text color={"customBlack"}>{description}</Text>
      </Flex>
    </Flex>
  );
};
export default MatchingCard2;
