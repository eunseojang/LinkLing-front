export interface PostData {
  post_id: number;
  post_img: string | undefined;
  post_detail: string;
  post_time: string;
  post_like: number;
  user_img: string | undefined;
  user_nation: string;
  post_comment: number;
  post_owner_id: string;
  post_owner_name: string;
}

export const commentsData = [
  {
    comment_id: 10,
    comment_detail: "나는 귀엽다 ㅎㅎ",
    comment_owner: "정메교",
    owner_img: undefined,
    comment_time: "2024-08-25",
  },
  {
    comment_id: 10,
    comment_detail: "나는 정메교가 너무 좋아",
    comment_owner: "eunseo",
    owner_img: undefined,
    comment_time: "2024-08-26",
  },
];
