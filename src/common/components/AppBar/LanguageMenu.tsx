import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@chakra-ui/icons";

const LanguageMenu = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        border={"none"}
        aria-label="Language"
        variant="outline"
        rightIcon={<MdKeyboardArrowDown />}
        display="flex"
        padding="10px"
      >
        <AiOutlineGlobal fontSize={"20px"} />
      </MenuButton>
      <MenuList>
        {["en", "ko", "zh", "ja"].map((lng) => (
          <MenuItem
            key={lng}
            onClick={() => handleLanguageChange(lng)}
            display="flex"
            alignItems="center"
            fontWeight={"normal"}
          >
            {i18n.language === lng && <CheckIcon color="green.500" mr="8px" />}
            {lng === "en" && "English"}
            {lng === "ko" && "한국어"}
            {lng === "zh" && "中文"}
            {lng === "ja" && "日本語"}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageMenu;
