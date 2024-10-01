// src/components/PopoverMenu.tsx
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { AiOutlineGlobal, AiOutlineSound } from "react-icons/ai";

interface PopoverMenuProps {
  menuPosition: { top: number; left: number } | null;
  translatedText: string | null;
  handleTranslateClick: () => void;
  handleSpeakClick: () => void;
  closeMenu: () => void;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({
  menuPosition,
  translatedText,
  handleTranslateClick,
  handleSpeakClick,
  closeMenu,
}) => {
  if (!menuPosition) return null;

  return (
    <Popover
      isOpen={true}
      onClose={closeMenu}
      placement="top-start"
      closeOnBlur={true}
    >
      <PopoverContent
        position="absolute"
        top={`${menuPosition.top}px`}
        left={`${menuPosition.left}px`}
        zIndex="popover"
        maxWidth="250px"
        overflow="auto"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          {translatedText ? (
            <Text>{translatedText}</Text>
          ) : (
            <>
              <Button
                size={"sm"}
                onClick={handleTranslateClick}
                leftIcon={<AiOutlineGlobal />}
                mr={1}
              >
                번역
              </Button>
              <Button
                size={"sm"}
                onClick={handleSpeakClick}
                leftIcon={<AiOutlineSound />}
              >
                소리내어 읽기
              </Button>
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
