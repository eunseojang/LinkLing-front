import {
  Avatar,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { User } from "../Utils/ChatUtils";
import { FiMoreVertical, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { fetcheImage } from "../../../common/utils/fetchImage"; // 이미지 fetching 함수 import
import { default_img } from "../../../common/utils/img"; // 기본 이미지 import

interface ChatAppBarProps {
  selectedUser: User;
  translateMode: boolean;
  setTranslateMode: (mode: boolean) => void;
}

function ChatAppBar({
  selectedUser,
  translateMode,
  setTranslateMode,
}: ChatAppBarProps) {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState<string>(default_img);

  // 프로필 이미지 로드
  useEffect(() => {
    const loadImage = async () => {
      if (selectedUser.user_profile) {
        const fetchedImage = await fetcheImage(selectedUser.user_profile);
        setProfileImage(fetchedImage || default_img);
      } else {
        setProfileImage(default_img);
      }
    };

    loadImage();
  }, [selectedUser]);

  const handleRemoveFriend = (user: User) => {
    console.log(`Removing ${user.user_nickname} from friends list.`);
  };

  return (
    <Flex
      p={4}
      h={"60px"}
      bg="#73DA95"
      align="center"
      justify="space-between"
      borderBottom="1px solid"
      borderColor="gray.300"
      shadow="md"
    >
      <HStack>
        <Avatar size="md" src={profileImage} />
        <Flex flexDirection={"column"}>
          <Text fontSize="xl" fontWeight="bold">
            {selectedUser.user_nickname}
          </Text>
          <Text fontSize="xs" color={"gray.100"} mt={-1}>
            {"@" + selectedUser.user_id}
          </Text>
        </Flex>
      </HStack>

      <Flex>
        <Tooltip label={t("friend.call")} fontSize="sm">
          <IconButton
            aria-label="Call"
            icon={<FiPhone />}
            size="lg"
            colorScheme="blue"
            variant="ghost"
            onClick={() => console.log(selectedUser.user_id)} // 전화 이벤트 핸들링
            mr={4}
          />
        </Tooltip>

        <HStack>
          <Text fontSize="md" fontWeight="semibold">
            {t(`translate.mode`)}
          </Text>
          <Switch
            isChecked={translateMode}
            onChange={() => setTranslateMode(!translateMode)}
            colorScheme="green"
            size="lg"
          />
        </HStack>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            colorScheme="linkling"
            color={"black"}
            icon={<FiMoreVertical />}
          />
          <MenuList>
            <MenuItem onClick={() => handleRemoveFriend(selectedUser)}>
              {t(`friend.deleteFriend`)}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default ChatAppBar;
