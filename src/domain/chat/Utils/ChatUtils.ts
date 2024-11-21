export interface User {
  cr_id: number;
  user_id: string;
  user_nickname: string;
  user_profile: string | undefined | null;
  unread_count: number;
  recent_msg: string;
}
