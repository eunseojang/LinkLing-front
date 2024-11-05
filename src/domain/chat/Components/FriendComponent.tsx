import { VStack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import {
  FriendList as fetchFriendList,
  FriendListRequest,
  confirmFriend,
  deleteFriend,
  searchUser,
  requestFriend,
} from "../api/FriendAPI";
import FriendSearch from "./FriendSearch";
import { Friend } from "../Utils/FriendUtils";
import FriendListContainer from "./FreindListContainer";
import { useToastMessage } from "../../../common/components/useToastMessage";

const FriendComponent: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const { showToast } = useToastMessage();
  useEffect(() => {
    fetchFriendList().then(setFriends);
    FriendListRequest().then(setFriendRequests);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const results = await searchUser(searchTerm);
    console.log(results);
    setSearchResults(results);
  };

  const handleRequestFriend = async (id: string) => {
    try {
      await requestFriend(id);
      showToast(
        "친구 요청 성공",
        "친구 요청을 성공적으로 보냈습니다.",
        "success"
      );
    } catch (error) {
      showToast(
        "친구 요청 실패",
        "이미 친구입니다",
        "error"
      );
    }
  };

  const handleConfirmRequest = async (id: string, confirm: boolean) => {
    await confirmFriend(id, confirm);
    window.location.reload();
  };

  const handleDeleteFriend = async (id: string) => {
    await deleteFriend(id);
    window.location.reload();
  };

  return (
    <VStack spacing={4}>
      <FriendSearch
        handleRequestFriend={handleRequestFriend}
        searchResults={searchResults}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />
      <FriendListContainer
        friends={friends}
        friendRequests={friendRequests}
        handleConfirmRequest={handleConfirmRequest}
        deleteFriend={handleDeleteFriend}
      />
    </VStack>
  );
};

export default FriendComponent;
