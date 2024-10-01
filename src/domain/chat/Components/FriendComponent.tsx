import {
  Box,
  Input,
  Button,
  Text,
  HStack,
  VStack,
  Avatar,
  Badge,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { default_img } from "../../../common/utils/img";

interface Friend {
  id: string;
  name: string;
  online: boolean;
  avatarUrl?: string;
}

const friendsList: Friend[] = [
  { id: "1", name: "김철수", online: true },
  { id: "2", name: "이영희", online: false },
  // Add more friends as needed
];

const FriendComponent: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "online">("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFriends = friendsList.filter((friend) => {
    const isMatchingName = friend.name.includes(searchTerm);
    const isOnline = filter === "online" ? friend.online : true;
    return isMatchingName && isOnline;
  });

  return (
    <VStack spacing={5}>
      <Box
        w="600px"
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        boxShadow="md"
      >
        <Text mb={4} fontWeight="bold" fontSize="lg" color="gray.700">
          사람 검색
        </Text>
        <HStack>
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="아이디 또는 닉네임으로 검색"
            variant="outline"
            focusBorderColor="green.400"
            size="md"
          />
          <Button colorScheme="linkling" size="md">
            검색
          </Button>
        </HStack>
      </Box>
      {/* bg={"#73DA95"} */}
      {/* Friends List */}
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
          사람 목록
        </Text>
        <Tabs
          variant="solid-rounded"
          colorScheme="customGreen"
          onChange={(index) => setFilter(index === 0 ? "all" : "online")}
        >
          <TabList mb={4} justifyContent="center">
            <Tab>모든 친구</Tab>
            <Tab>요청 목록</Tab>
          </TabList>
          <Divider mb={4} />
          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={4} align="stretch">
                {filteredFriends.map((friend) => (
                  <HStack
                    key={friend.id}
                    justify="space-between"
                    p={2}
                    _hover={{ bg: "gray.50" }}
                    borderRadius="md"
                  >
                    <HStack>
                      <Avatar size="md" src={friend.avatarUrl || default_img} />
                      <VStack spacing={0} align="start">
                        <Text fontWeight="bold" color="gray.800">
                          {friend.name}
                        </Text>
                        <HStack spacing={1}>
                          <Badge
                            colorScheme={friend.online ? "green" : "gray"}
                            variant="subtle"
                            fontSize="sm"
                          >
                            {friend.online ? "온라인" : "오프라인"}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Flex>
                      <Button
                        size="sm"
                        mr={2}
                        colorScheme="linkling"
                        variant="outline"
                      >
                        채팅 보내기
                      </Button>
                      <Button size="sm" colorScheme="red" variant="outline">
                        삭제
                      </Button>
                    </Flex>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
};

export default FriendComponent;
