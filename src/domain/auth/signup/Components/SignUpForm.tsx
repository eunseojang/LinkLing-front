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
import { useSignUpForm } from "../hooks/useSignupForm";
import EmailSection from "./EmailSection";
import SelectionButton from "../../../../common/components/SelectedButton";

const SignUpForm = () => {
  const { t } = useTranslation();
  const {
    id,
    email,
    password,
    correctpassword,
    nickname,
    idError,
    emailError,
    passwordError,
    correctpasswordError,
    genderError,
    nationalityError,
    nicknameError,
    handleChange,
    onSubmit,
    handleIdCheck,
    emailVerified,
    setEmailVerified,
    idVerified,
  } = useSignUpForm();

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
          <EmailSection
            email={email}
            emailError={emailError}
            emailVerified={emailVerified}
            setEmailVerified={setEmailVerified}
            handleChange={handleChange}
          />

          {/* ID 입력 필드 */}
          <FormControl isInvalid={!!idError}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="id" w="120px" mb={0}>
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
                minW={"90px"}
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
            <FormErrorMessage ml={"130px"} mb={2}>
              {idError}
            </FormErrorMessage>
          </FormControl>

          {/* 비밀번호 입력 필드 */}
          <FormControl isInvalid={!!passwordError}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="password" w="120px" mb={0}>
                {t("signup.password")}
              </FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={t("signup.passwordPlaceHolder")}
                flex="1"
              />
            </Flex>
            <FormErrorMessage ml={"130px"} mb={2}>
              {passwordError}
            </FormErrorMessage>
          </FormControl>

          {/* 비밀번호 확인 입력 필드 */}
          <FormControl isInvalid={!!correctpasswordError}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="correctpassword" w="120px" mb={0}>
                {t("signup.correctpassword")}
              </FormLabel>
              <Input
                id="correctpassword"
                type="password"
                value={correctpassword}
                onChange={(e) =>
                  handleChange("correctpassword", e.target.value)
                }
                placeholder={t("signup.correctpasswordPlaceHolder")}
                flex="1"
              />
            </Flex>
            <FormErrorMessage ml={"130px"} mb={3}>
              {correctpasswordError}
            </FormErrorMessage>
          </FormControl>

          {/* 성별 선택 */}
          <FormControl isInvalid={!!genderError} mt={3}>
            <Flex mb={2} wrap="wrap" gap={2} align={"center"}>
              <FormLabel w={"120px"}>{t("signup.gender")}</FormLabel>
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
            <FormErrorMessage ml={"130px"} mb={2}>
              {genderError}
            </FormErrorMessage>
          </FormControl>

          {/* 국가 선택 */}
          <FormControl isInvalid={!!nationalityError} mt={2}>
            <Flex align="center">
              <FormLabel width="120px" mb={0}>
                {t("signup.nationality")}
              </FormLabel>
              <Flex wrap="wrap" ml={2} gap={2} flex="1">
                <SelectionButton
                  onClick={() => handleNationalitySelect("KR")}
                  isSelected={selectedNationality === "KR"}
                  label={t("signup.korea")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("US")}
                  isSelected={selectedNationality === "US"}
                  label={t("signup.usa")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("JP")}
                  isSelected={selectedNationality === "JP"}
                  label={t("signup.japan")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("CN")}
                  isSelected={selectedNationality === "CN"}
                  label={t("signup.china")}
                />
                <SelectionButton
                  onClick={() => handleNationalitySelect("GT")}
                  isSelected={selectedNationality === "GT"}
                  label={t("signup.other")}
                />
              </Flex>
            </Flex>
            <FormErrorMessage ml="140px" mt={2}>
              {nationalityError}
            </FormErrorMessage>
          </FormControl>

          {/* 닉네임 입력 필드 */}
          <FormControl isInvalid={!!nicknameError} mt={5}>
            <Flex mb={2} align="center">
              <FormLabel htmlFor="nickname" w="120px" mb={0}>
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
            <FormErrorMessage ml={"130px"}>{nicknameError}</FormErrorMessage>
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

export default SignUpForm;
