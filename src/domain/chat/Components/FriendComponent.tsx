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
import SearchResults from "./SearchResults";
import { Friend } from "../Utils/FriendUtils";
import FriendListContainer from "./FreindListContainer";

const FriendComponent: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  // 친구 목록과 요청 목록 불러오기
  useEffect(() => {
    fetchFriendList().then(setFriends);
    FriendListRequest().then(setFriendRequests);
  }, []);

  // 검색 필드 변경
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 사용자 검색
  const handleSearch = async () => {
    const results = await searchUser(searchTerm);
    setSearchResults(results);
  };

  // 친구 요청 보내기
  const handleRequestFriend = async (id: string) => {
    await requestFriend(id);
    window.location.reload();
  };

  // 친구 요청 수락 및 거절
  const handleConfirmRequest = async (id: string, confirm: boolean) => {
    await confirmFriend(id, confirm);
    window.location.reload();
  };

  // 친구 삭제
  const handleDeleteFriend = async (id: string) => {
    await deleteFriend(id);
    window.location.reload();
  };

  return (
    <VStack spacing={4}>
      {/* 검색 컴포넌트 */}
      <FriendSearch
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />
      {/* 검색 결과 컴포넌트 */}
      <SearchResults
        searchResults={searchResults}
        handleRequestFriend={handleRequestFriend}
      />
      {/* 친구 목록 및 요청 컴포넌트 */}
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
