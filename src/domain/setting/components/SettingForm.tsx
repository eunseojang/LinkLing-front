import { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Spinner,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { useProfileSettings } from "../hook/useProfileSettings";
import SelectionButton from "../../../common/components/SelectedButton";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useToastMessage } from "../../../common/components/useToastMessage";

const SettingForm = () => {
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    changeID,
    changePassword,
  } = useProfileSettings();

  const [newID, setNewID] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [existPassword, setExistPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [gender, setGender] = useState<string | null>(null);
  const [nation, setNation] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const toastStatus = localStorage.getItem("showToast");
    if (toastStatus) {
      showToast(
        "idChange.success",
        "ID가 성공적으로 변경되었습니다.",
        "success"
      );
      localStorage.removeItem("showToast");
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setGender(profile.user_gender);
      setNation(profile.user_nation);
    }
  }, [profile]);

  const handleIDChange = async () => {
    if (profile) {
      try {
        await changeID(profile.user_id, newID);
        localStorage.setItem("showToast", "true");

        window.location.reload();

        setNewID("");
      } catch (error) {
        showToast("settrings.currentfail", "settrings.currentfaildes", "error");
      }
    }
  };

  const handlePasswordChange = async () => {
    if (profile && newPassword === confirmPassword) {
      try {
        await changePassword(profile.user_id, existPassword, newPassword);
        showToast(`password.success`, `password.successDes`, "success");
        setNewPassword("");
        setExistPassword("");
        setConfirmPassword("");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.code === 4005932) {
            showToast(
              `password.currentfail`,
              `password.currentfailDes`,
              "error"
            );
          } else if (error.response?.data?.code === 4000007) {
            showToast(`password.fail`, `password.failDes`, "error");
          } else if (error.response?.data?.code === 4004132) {
            showToast(
              `password.duplication`,
              `password.duplicationDes`,
              "error"
            );
          }
        }
      }
    }
  };

  const handleProfileUpdate = async () => {
    if (profile) {
      await updateProfile(
        profile.user_name,
        profile.user_info,
        gender!,
        nation!
      );
      await fetchProfile();
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" w={"full"}>
        <Spinner size="md" />
      </Flex>
    );
  }

  return (
    <Box p={4} maxW="3xl" borderRadius="lg" margin="0 auto" bg="white">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>{t("settings.id", "ID")}</FormLabel>
          <Input
            value={newID}
            onChange={(e) => setNewID(e.target.value)}
            placeholder={
              profile
                ? profile.user_id
                : t("settings.idPlaceholder", "Enter new ID")
            }
          />
          <Button
            onClick={handleIDChange}
            mt={2}
            colorScheme="linkling"
            w="full"
          >
            {t("settings.changeID", "Change ID")}
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel>{t("settings.newPassword", "New Password")}</FormLabel>
          <Input
            type="password"
            value={existPassword}
            onChange={(e) => setExistPassword(e.target.value)}
            placeholder={t(
              "settings.existpasswordPlaceholder",
              "Enter new password"
            )}
          />
          <Input
            mt={2}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t(
              "settings.passwordPlaceholder",
              "Enter new password"
            )}
          />
          <Input
            mt={2}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t(
              "settings.passwordPlaceholder1",
              "Enter new password"
            )}
          />
          <Button
            onClick={handlePasswordChange}
            mt={2}
            colorScheme="linkling"
            w="full"
          >
            {t("settings.changePassword", "Change Password")}
          </Button>
        </FormControl>

        <FormControl>
          <Flex mb={2} mt={10} wrap="wrap" gap={2} align="center">
            <FormLabel w="50px">{t("signup.gender", "Gender")}</FormLabel>
            <SelectionButton
              onClick={() => setGender("male")}
              isSelected={gender === "male"}
              label={t("signup.male", "Male")}
            />
            <SelectionButton
              onClick={() => setGender("female")}
              isSelected={gender === "female"}
              label={t("signup.female", "Female")}
            />
            <SelectionButton
              onClick={() => setGender("other")}
              isSelected={gender === "other"}
              label={t("signup.other", "Other")}
            />
          </Flex>
        </FormControl>

        <FormControl>
          <Flex align="center">
            <FormLabel w="50px" mb={0}>
              {t("signup.nationality", "Nationality")}
            </FormLabel>
            <Flex wrap="wrap" ml={2} gap={2} flex="1">
              <SelectionButton
                onClick={() => setNation("KR")}
                isSelected={nation === "KR"}
                label={t("signup.korea", "Korea")}
              />
              <SelectionButton
                onClick={() => setNation("US")}
                isSelected={nation === "US"}
                label={t("signup.usa", "USA")}
              />
              <SelectionButton
                onClick={() => setNation("JP")}
                isSelected={nation === "JP"}
                label={t("signup.japan", "Japan")}
              />
              <SelectionButton
                onClick={() => setNation("CN")}
                isSelected={nation === "CN"}
                label={t("signup.china", "China")}
              />
              <SelectionButton
                onClick={() => setNation("GT")}
                isSelected={nation === "GT"}
                label={t("signup.other", "Other")}
              />
            </Flex>
          </Flex>
        </FormControl>

        <Button onClick={handleProfileUpdate} colorScheme="linkling" w="full">
          {t("settings.updateProfile", "Update Profile")}
        </Button>
      </Stack>
    </Box>
  );
};

export default SettingForm;
