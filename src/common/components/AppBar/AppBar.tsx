import React from "react";
import { Text, Flex, Image, Button, Icon } from "@chakra-ui/react";
import { FaUserCircle, FaLink, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 추가된 부분
import LanguageMenu from "./LanguageMenu";
import { useAuthStore } from "../../store/AuthStore";
import { getNicknameToken } from "../../utils/nickname";
import { useTranslation } from "react-i18next";

const AppBar: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate(); // 추가된 부분
  const { t } = useTranslation();
  const menuItems = [
    { label: `menu.community`, icon: FaUsers, path: "/community" },
    { label: `menu.ling`, icon: FaLink, path: "/links" },
    {
      label: `menu.profile`,
      icon: FaUserCircle,
      path: `${getNicknameToken()}`,
    },
  ];

  return (
    <Flex
      w="full"
      h="60px"
      // borderBottom="1px"
      // borderColor="gray.200"
      shadow="xs"
      justify="space-between"
      direction="row"
      position="fixed"
      top="0"
      bg="white"
      zIndex="1000"
      alignItems="center"
      px="20px"
    >
      <Flex
        align="center"
        cursor={"pointer"}
        onClick={() => {
          navigate("/");
        }}
      >
        <Image
          src="/greenLogo.png"
          alt="linkling"
          boxSize="40px"
          objectFit="contain"
        />
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          align="center"
          color="#73DA95"
          ml="10px"
        >
          LinkLing
        </Text>
      </Flex>
      <Button onClick={logout} ml="20px">
        임시 로그아웃
      </Button>

      <Flex justifyContent="space-between" align="center">
        <Flex mr={50}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              leftIcon={<Icon as={item.icon} />}
              variant="ghost"
              fontSize="lg"
              color="black"
              _hover={{ color: "#73DA95" }}
              transition="color 0.3s ease-in-out"
              onClick={() => navigate(item.path)} // 경로로 이동
            >
              {t(item.label)}
            </Button>
          ))}
        </Flex>
        <LanguageMenu />
      </Flex>
    </Flex>
  );
};

export default AppBar;
