import { useState } from "react";
import {
  resetID,
  resetPassword,
  getProfile,
  putProfile,
} from "../api/SettingAPI";
import { UserProfile } from "../../profile/utils/ProfileUtils";
import { getNicknameToken } from "../../../common/utils/nickname";

export const useProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const id = getNicknameToken();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(id);
      setProfile(data);
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    user_profile: string,
    user_name: string,
    user_info: string,
    user_gender: string,
    user_nation: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await putProfile(
        id,
        user_profile,
        user_name,
        user_info,
        user_gender,
        user_nation
      );
      setProfile(data);
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const changeID = async (id: string, new_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resetID(id, new_id);
      console.log(data);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
    } catch (error) {
      setError("Failed to change ID");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (id: string, new_pw: string) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(id, new_pw);
    } catch (error) {
      setError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changeID,
    changePassword,
  };
};
