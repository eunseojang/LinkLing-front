import React from "react";
import { Text, Flex, Image } from "@chakra-ui/react";
import LanguageMenu from "./LanguageMenu";

const AppBar: React.FC = () => {

  return (
    <Flex
      w="full"
      h="60px"
      borderBottom="1px"
      borderColor="#CDCDCD"
      justify="space-between"
      direction="row"
      position="fixed"
      top="0"
      bg="white"
      zIndex="1000"
      alignItems="center"
      px="20px"
    >
      <Flex align="center">
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

export default AppBar;
