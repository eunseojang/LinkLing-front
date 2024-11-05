import axiosInstance from "../../../common/api/axiosInstance";

//유저검색
export const searchUser = async (target: string) => {
  try {
    const response = await axiosInstance.get(
      `/profile/search-user?target=${target}`
    );
    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//친구삭제
export const deleteFriend = async (target_id: string) => {
  try {
    const response = await axiosInstance.delete(
      `/delete-friend?target_id=${target_id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//친구목록
export const FriendList = async () => {
  try {
    const response = await axiosInstance.get(`/inquiry-friend-list`);
    return response.data.friend_list;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//친구요청목록
export const FriendListRequest = async () => {
  try {
    const response = await axiosInstance.get(`/inquiry-friend-request`);
    return response.data.friend_requests;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//친추 승인 거절
export const confirmFriend = async (target_id: string, confirm: boolean) => {
  try {
    console.log(target_id);
    const response = await axiosInstance.post(`/confirm-friend`, {
      target_id,
      confirm,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//친추 요청
export const requestFriend = async (target_id: string) => {
  try {
    const response = await axiosInstance.post(`/request-friend`, { target_id });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
