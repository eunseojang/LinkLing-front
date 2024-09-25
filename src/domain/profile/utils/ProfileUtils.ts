export interface UserProfile {
  user_profile: string;
  user_id: string;
  user_name: string;
  user_gender: "male" | "female" | "other";
  online: boolean;
  follower: number;
  user_nation: "KR" | "JP" | "CN" | "US" | "GT";
  user_info: string;
  profile_info: "HOST" | "FRIEND" | "PENDING" | "ACCEPT" | "NOTFRIEND";
}

export const getFlagClass = (nation: string) => {
  switch (nation) {
    case "KR":
      return "fi fi-kr"; // South Korea
    case "US":
      return "fi fi-us"; // United States
    case "JP":
      return "fi fi-jp"; // Japan
    case "CN":
      return "fi fi-cn"; // China
    default:
      return ""; // Globe icon for unknown country
  }
};