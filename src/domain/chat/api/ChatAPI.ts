import axiosInstance from "../../../common/api/axiosInstance";

//채팅방 친구 목록
export const getFriendList = async () => {
  try {
    const response = await axiosInstance.get(`/api/chat/friendlist`);
    return response.data.data.friend_list;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//채팅방 생성 or 조회하기
export const getChatRoomID = async (target_id: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/chat/room?target_id=${target_id}`
    );
    return response.data.data.chat_room_info.cr_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
