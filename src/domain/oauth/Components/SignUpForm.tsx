import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import SelectionButton from "../../../common/components/SelectedButton";
import { useOauthSignUpForm } from "../hooks/useSignupForm";

const OauthSignUpForm = () => {
  const { t } = useTranslation();
  const {
    id,
    nickname,
    idError,
    genderError,
    nationalityError,
    nicknameError,
    handleChange,
    onSubmit,
    handleIdCheck,
    idVerified,
  } = useOauthSignUpForm();

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedNationality, setSelectedNationality] = useState<string | null>(
    null
  );

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    handleChange("gender", gender);
  };

  const handleNationalitySelect = (nationality: string) => {
    setSelectedNationality(nationality);
    handleChange("nationality", nationality);
  };

  return (
    <Box bg="white" p={8} w="600px" borderRadius="3xl" margin={"0 auto"}>
      <form onSubmit={onSubmit}>
        <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
          {t(`signup.signup`)}
        </Text>
        <Text fontSize="sm" fontWeight="400" mb={5} textAlign="center">
          {t(`signup.info`)}
        </Text>
        <Stack spacing={0}>
          {/* ID 입력 필드 */}
          <FormControl isInvalid={!!idError}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="id" w="80px" mb={0}>
                {t("signup.id")}
              </FormLabel>
              <Input
                id="id"
                value={id}
                onChange={(e) => handleChange("id", e.target.value)}
                placeholder={t("signup.idPlaceHolder")}
                flex="1"
              />
              <Button
                w={"90px"}
                onClick={handleIdCheck}
                bg="#73DA95"
                color="white"
                size="sm"
                ml={2}
                isDisabled={idVerified}
              >
                {t("signup.checkId")}
              </Button>
            </Flex>
            <FormErrorMessage ml={"90px"} mb={2}>
              {idError}
            </FormErrorMessage>
          </FormControl>

          {/* 성별 선택 */}
          <FormControl isInvalid={!!genderError} mt={3}>
            <Flex mb={2} wrap="wrap" gap={2} align={"center"}>
              <FormLabel width={"80px"}>{t("signup.gender")}</FormLabel>
              <SelectionButton
                onClick={() => handleGenderSelect("male")}
                isSelected={selectedGender === "male"}
                label={t("signup.male")}
              />
              <SelectionButton
                onClick={() => handleGenderSelect("female")}
                isSelected={selectedGender === "female"}
                label={t("signup.female")}
              />
              <SelectionButton
                onClick={() => handleGenderSelect("other")}
                isSelected={selectedGender === "other"}
                label={t("signup.other")}
              />
            </Flex>
            <FormErrorMessage mb={3} ml={"100px"}>
              {genderError}
            </FormErrorMessage>
          </FormControl>

          {/* 국가 선택 */}
          <FormControl isInvalid={!!nationalityError} mt={2}>
            <Flex align="center">
              <FormLabel width="80px" mb={0}>
                {t("signup.nationality")}
              </FormLabel>
              <Flex wrap="wrap" ml={2} gap={2} flex="1">
                <SelectionButton
                  onClick={() => handleNationalitySelect("kr")}
                  isSelected={selectedNationality === "kr"}
                  label={t("signup.korea")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("us")}
                  isSelected={selectedNationality === "us"}
                  label={t("signup.usa")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("jp")}
                  isSelected={selectedNationality === "jp"}
                  label={t("signup.japan")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("cn")}
                  isSelected={selectedNationality === "cn"}
                  label={t("signup.china")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("other")}
                  isSelected={selectedNationality === "other"}
                  label={t("signup.other")}
                />
              </Flex>
            </Flex>
            <FormErrorMessage ml="100px" mt={2}>
              {nationalityError}
            </FormErrorMessage>
          </FormControl>

          {/* 닉네임 입력 필드 */}
          <FormControl isInvalid={!!nicknameError} mt={5}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="nickname" width={"80px"} mb={0}>
                {t("signup.nickname")}
              </FormLabel>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => handleChange("nickname", e.target.value)}
                placeholder={t("signup.nicknamePlaceHolder")}
                flex="1"
              />
            </Flex>
            <FormErrorMessage ml={"90px"}>{nicknameError}</FormErrorMessage>
          </FormControl>

          <Button
            mt={5}
            type="submit"
            bg="#73DA95"
            color="white"
            size="lg"
            width="full"
          >
            {t("signup.signup")}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default OauthSignUpForm;
