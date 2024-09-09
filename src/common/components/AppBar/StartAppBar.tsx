import React from "react";
import { Text, Flex, Image } from "@chakra-ui/react";
import LanguageMenu from "./LanguageMenu";
import { useNavigate } from "react-router-dom";

const StartAppBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Flex
      position={"fixed"}
      w="full"
      h="60px"
      justify="space-between"
      direction="row"
      top="0"
      bg="#F7F9F4"
      zIndex="1000"
      alignItems="center"
      px="20px"
    >
      <Flex align="center" onClick={() => navigate("/")}>
        <Image
          src="/greenLogo.png"
          alt={"linkling"}
          boxSize="40px"
          objectFit="contain"
        />
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          align="center"
          color="#73DA95"
        >
          LinkLing
        </Text>
      </Flex>
      <LanguageMenu />
    </Flex>
  );
};

export default StartAppBar;
