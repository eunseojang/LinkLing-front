import {
  Box,
  Input,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { resetPassword, resetPasswordAuth } from "../api/FindPasswordAPI";
import { useToastMessage } from "../../../../common/components/useToastMessage";

const FindPasswordForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenStage, setIsTokenStage] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false); // Loading state for email submission
  const [isLoadingToken, setIsLoadingToken] = useState(false); // Loading state for token submission
  const navigate = useNavigate();
  const { showToast } = useToastMessage();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToken(e.target.value);

  const handleEmailSubmit = async () => {
    setIsLoadingEmail(true); // Start loading spinner for email submission
    try {
      const response = await resetPasswordAuth(email);
      if (response) {
        setIsTokenStage(true);
        showToast("email.sendsuccess", "email.checkEmail", "success");
      } else {
        showToast("email.sendfail", "email.checkEmail", "error");
      }
    } catch (error) {
      showToast("email.sendfail", "email.checkEmail", "error");
    } finally {
      setIsLoadingEmail(false); // Stop loading spinner for email submission
    }
  };

  const handleTokenSubmit = async () => {
    setIsLoadingToken(true); // Start loading spinner for token submission
    try {
      const response = await resetPassword(email, token);

      if (response) {
        setIsSuccess(true);
        showToast("email.resetsuccess", "email.passwordReset", "success");
      } else {
        showToast("email.resetfail", "email.tokenInvalid", "error");
      }
    } catch (error) {
      showToast("email.resetfail", "email.tokenInvalid", "error");
    } finally {
      setIsLoadingToken(false); // Stop loading spinner for token submission
    }
  };

  return (
    <Box
      bg="white"
      p={8}
      maxW="md"
      w="full"
      borderRadius="3xl"
      margin={"0 auto"}
    >
      <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
        {t("email.findPassword")}
      </Text>

      {isSuccess ? (
        <>
          <Alert status="success" mb={4} mt={5}>
            <AlertIcon />
            {t("email.passwordReset")}
          </Alert>
          <Button
            mt={3}
            bg="#73DA95"
            color="white"
            w="full"
            onClick={() => navigate("/login")}
          >
            {t("email.loginGo")}
          </Button>
        </>
      ) : isTokenStage ? (
        <>
          <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
            {t("email.enterToken")}
          </Text>
          <Input
            placeholder={t("email.tokenPlaceholder")}
            value={token}
            onChange={handleTokenChange}
            mb={6}
          />
          <Button
            bg="#73DA95"
            color="white"
            w="full"
            onClick={handleTokenSubmit}
            disabled={isLoadingToken} // Disable button while loading
          >
            {isLoadingToken ? <Spinner size="sm" /> : t("email.resetPassword")}
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
            {t("email.existEamilId")}
          </Text>
          <Input
            placeholder={t(`signup.email`)}
            value={email}
            onChange={handleEmailChange}
            mb={6}
          />
          <Button
            bg="#73DA95"
            color="white"
            w="full"
            onClick={handleEmailSubmit}
            disabled={isLoadingEmail}
          >
            {isLoadingEmail ? <Spinner size="sm" /> : t("email.sendToken")}
          </Button>
        </>
      )}
    </Box>
  );
};

export default FindPasswordForm;
