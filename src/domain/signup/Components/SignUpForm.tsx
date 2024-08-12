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
    <Box bg="white" p={8} w="700px" borderRadius="3xl">
      <form onSubmit={onSubmit}>
        <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
          {t(`signup.signup`)}
        </Text>
        <Text fontSize="sm" fontWeight="400" mb={10} textAlign="center">
          {t(`signup.info`)}
        </Text>
        <Stack spacing={3}>
          <EmailSection
            email={email}
            emailError={emailError}
            emailVerified={emailVerified}
            setEmailVerified={setEmailVerified}
            handleChange={handleChange}
          />

          {/* ID 입력 필드 */}
          <FormControl isInvalid={!!idError}>
            <Flex mb={4} align="center">
              <FormLabel htmlFor="id" w="150px" mb={0}>
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
                onClick={handleIdCheck}
                colorScheme="teal"
                size="sm"
                ml={2}
              >
                {t("signup.checkId")}
              </Button>
            </Flex>
            <FormErrorMessage ml={"170px"}>{idError}</FormErrorMessage>
          </FormControl>

          {/* 비밀번호 입력 필드 */}
          <FormControl isInvalid={!!passwordError}>
            <Flex mb={4} align="center">
              <FormLabel htmlFor="password" w="150px" mb={0}>
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
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          </FormControl>

          {/* 비밀번호 확인 입력 필드 */}
          <FormControl isInvalid={!!correctpasswordError}>
            <Flex mb={4} align="center">
              <FormLabel htmlFor="correctpassword" w="150px" mb={0}>
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
            <FormErrorMessage>{correctpasswordError}</FormErrorMessage>
          </FormControl>

          {/* 성별 선택 */}
          <FormControl isInvalid={!!genderError}>
            <FormLabel mb={0}>{t("signup.gender")}</FormLabel>
            <Flex mb={4} wrap="wrap" gap={2}>
              <Button
                onClick={() => handleGenderSelect("male")}
                variant={selectedGender === "male" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.male")}
              </Button>
              <Button
                onClick={() => handleGenderSelect("female")}
                variant={selectedGender === "female" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.female")}
              </Button>
              <Button
                onClick={() => handleGenderSelect("other")}
                variant={selectedGender === "other" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.other")}
              </Button>
            </Flex>
            <FormErrorMessage>{genderError}</FormErrorMessage>
          </FormControl>

          {/* 국가 선택 */}
          <FormControl isInvalid={!!nationalityError}>
            <FormLabel mb={0}>{t("signup.nationality")}</FormLabel>
            <Flex wrap="wrap" gap={2}>
              <Button
                onClick={() => handleNationalitySelect("kr")}
                variant={selectedNationality === "kr" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.korea")}
              </Button>
              <Button
                onClick={() => handleNationalitySelect("us")}
                variant={selectedNationality === "us" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.usa")}
              </Button>
              <Button
                onClick={() => handleNationalitySelect("jp")}
                variant={selectedNationality === "jp" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.japan")}
              </Button>
              <Button
                onClick={() => handleNationalitySelect("cn")}
                variant={selectedNationality === "cn" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.china")}
              </Button>
              <Button
                onClick={() => handleNationalitySelect("other")}
                variant={selectedNationality === "other" ? "solid" : "outline"}
                colorScheme="teal"
              >
                {t("signup.other")}
              </Button>
            </Flex>
            <FormErrorMessage>{nationalityError}</FormErrorMessage>
          </FormControl>

          {/* 닉네임 입력 필드 */}
          <FormControl isInvalid={!!nicknameError} mt={5}>
            <Flex mb={4} align="center">
              <FormLabel htmlFor="nickname" w="150px" mb={0}>
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
            <FormErrorMessage>{nicknameError}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" size="lg" width="full">
            {t("signup.signup")}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUpForm;
