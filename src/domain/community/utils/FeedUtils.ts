export interface PostData {
  post_id: number;
  post_img: string | undefined;
  post_detail: string;
  post_owner: string;
  post_time: string;
  post_like: number;
  user_img: string | undefined;
  user_nation: string;
  post_comment: number;
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

export const feedData: PostData[] = [
  {
    post_id: 1,
    post_img: undefined,
    post_detail: "This is the first post",
    post_owner: "eunseo",
    post_time: "2024-08-25",
    post_like: 9999,
    user_img: undefined,
    user_nation: "KR",
    post_comment: 3,
  },
  {
    post_id: 2,
    post_img:
      "https://health.chosun.com/site/data/img_dir/2023/01/10/2023011001501_0.jpg",
    post_detail: "This is the second post",
    post_owner: "id3",
    post_time: "2024-08-25",
    post_like: 9999999,
    user_img:
      "https://health.chosun.com/site/data/img_dir/2023/01/10/2023011001501_0.jpg",
    user_nation: "KR",
    post_comment: 5,
  },
  {
    post_id: 3,
    post_img: "https://img.siksinhot.com/place/1467510439034092.jpg",
    post_detail: "こんにちは。今日は金曜日です。",
    post_owner: "id3",
    post_time: "2024-08-25",
    post_like: 500,
    user_img: undefined,
    user_nation: "KR",
    post_comment: 5,
  },
];
