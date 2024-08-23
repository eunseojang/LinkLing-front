import { Box, Input, Text, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import { findePassword } from "../../login/api/LoginAPI";
import { useToastMessage } from "../../../common/components/useToastMessage";

const FindPasswordForm = () => {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToastMessage();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setId(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSubmit = async () => {
    try {
      //   const response = await findePassword(id, email);
      const response = "ㄴㄴㅇㄹㄴㅇㄹ";

      if (response) {
        setIsSuccess(true);
        showToast("email.sendsuccess", "email.checkEmail", "success");
      } else {
        showToast("email.sendfail", "email,checkIDcheckEmail", "error");
      }
    } catch (error) {
      showToast("email.sendfail", "email,checkIDcheckEmail", "error");
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
            {t("email.checkEmail")}
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
      ) : (
        <>
          <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
            {t("email.existEamilId")}
          </Text>
          <Input
            placeholder={t(`login.id`)}
            value={id}
            onChange={handleIdChange}
            mb={4}
          />
          <Input
            placeholder={t(`signup.email`)}
            value={email}
            onChange={handleEmailChange}
            mb={6}
          />
          <Button bg="#73DA95" color="white" w="full" onClick={handleSubmit}>
            {t("email.findPassword")}
          </Button>
        </>
      )}
    </Box>
  );
};

export default FindPasswordForm;
