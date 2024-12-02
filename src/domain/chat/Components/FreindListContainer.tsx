import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import { Friend } from "../Utils/FriendUtils";
import { useNavigate } from "react-router-dom";

interface FriendListContainerProps {
  friends: Friend[];
  friendRequests: Friend[];
  handleConfirmRequest: (id: string, confirm: boolean) => void;
  deleteFriend: (id: string) => void;
  handleChatGo: (id: number) => void;
}

const FriendListContainer: FC<FriendListContainerProps> = ({
  friends,
  friendRequests,
  handleConfirmRequest,
  deleteFriend,
  handleChatGo,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "request">("all");

  return (
    <Box
      w="600px"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="md"
      h={"395px"}
    >
      <Text mb={4} fontWeight="bold" fontSize="lg" color="gray.700">
        {t(`friend.list`)}
      </Text>
      <Tabs
        variant="solid-rounded"
        colorScheme="customGreen"
        onChange={(index) => setFilter(index === 0 ? "all" : "request")}
      >
        <TabList mb={4} justifyContent="center">
          <Tab>{t(`friend.all`)}</Tab>
          <Tab>
            {t(`friend.requestList`)}
            {friendRequests.length > 0 && (
              <Badge ml={2} colorScheme="red" borderRadius="full">
                {friendRequests.length}
              </Badge>
            )}
          </Tab>
        </TabList>
        <Divider mb={4} />
        <TabPanels>
          <TabPanel p={0} hidden={filter !== "all"}>
            <FriendList
              handleChatGo={handleChatGo}
              friends={friends}
              deleteFriend={deleteFriend}
              navigate={navigate}
            />
          </TabPanel>

          <TabPanel p={0} hidden={filter !== "request"}>
            <FriendRequestList
              friendRequests={friendRequests}
              handleConfirmRequest={handleConfirmRequest}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FriendListContainer;
