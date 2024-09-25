import React from "react";
import {
  Text,
  Flex,
  Image,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaUserCircle,
  FaLink,
  FaUsers,
  FaCommentAlt,
  FaCog,
} from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import LanguageMenu from "./LanguageMenu";
import { useAuthStore } from "../../store/AuthStore";
import { getNicknameToken } from "../../utils/nickname";
import { useTranslation } from "react-i18next";

const AppBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const menuItems = [
    { label: `menu.linkchat`, icon: FaCommentAlt, path: "/linkchat" },
    { label: `menu.community`, icon: FaUsers, path: "/community" },
    { label: `menu.ling`, icon: FaLink, path: "/ling" },
    {
      label: `menu.profile`,
      icon: FaUserCircle,
      path: `/${getNicknameToken()}`,
    },
  ];

  return (
    <Flex
      w="full"
      h="60px"
      shadow="xs"
      justify="space-between"
      direction="row"
      position="fixed"
      top="0"
      bg="white"
      zIndex="1000"
      alignItems="center"
      px={isMobile ? "10px" : "20px"}
    >
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <Image
          src="/greenLogo.png"
          alt="linkling"
          boxSize={isMobile ? "30px" : "40px"}
          objectFit="contain"
        />
        <Text
          fontSize={isMobile ? "xl" : "2xl"}
          fontWeight="extrabold"
          align="center"
          color="#73DA95"
          ml={isMobile ? undefined : "8px"}
        >
          LinkLing
        </Text>
      </Flex>

      {!isAuthenticated ? (
        <Flex>
          <Button
            onClick={() => navigate("/login")}
            ml="20px"
            mr={3}
            colorScheme="linkling"
          >
            {t("menu.login")}
          </Button>
          <LanguageMenu />
        </Flex>
      ) : (
        <Flex justifyContent="space-between" align="center">
          {/* 모바일일 때는 MenuList로, 그렇지 않을 때는 기존 버튼 배열 */}
          {!isMobile && (
            <Flex mr={"10px"}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  leftIcon={<Icon as={item.icon} />}
                  variant="ghost"
                  fontSize="lg"
                  color="#333333"
                  _hover={{ color: "#73DA95" }}
                  transition="color 0.3s ease-in-out"
                  onClick={() => navigate(item.path)}
                >
                  {t(item.label)}
                </Button>
              ))}
            </Flex>
          )}

          <Menu>
            <MenuButton
              mr={"10px"}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              colorScheme="customGreen"
              border={"1px solid"}
            >
              @{getNicknameToken()}
            </MenuButton>
            <MenuList>
              {isMobile &&
                menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={<Icon as={item.icon} />}
                    onClick={() => navigate(item.path)}
                  >
                    {t(item.label)}
                  </MenuItem>
                ))}
              <MenuItem icon={<FaCog />} onClick={() => navigate("/setting")}>
                {t("menu.setting")}
              </MenuItem>
              <MenuItem icon={<FaUserCircle />} onClick={logout}>
                {t("menu.logout")}
              </MenuItem>
            </MenuList>
          </Menu>

          <LanguageMenu />
        </Flex>
      )}
    </Flex>
  );
};

export default AppBar;
