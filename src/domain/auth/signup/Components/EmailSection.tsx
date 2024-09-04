import React, { useState, useEffect } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { checkEmail, verifyEmail } from "../api/EmailAPI";
import { useToastMessage } from "../../../../common/components/useToastMessage";

interface SignUpFormValues {
  id: string;
  email: string;
  password: string;
  correctpassword: string;
  gender: string;
  nationality: string;
  nickname: string;
}

interface EmailSectionProps {
  email: string;
  emailError: string | null;
  emailVerified: boolean;
  setEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (field: keyof SignUpFormValues, value: string) => void;
}

const EmailSection: React.FC<EmailSectionProps> = ({
  email,
  emailError,
  emailVerified,
  setEmailVerified,
  handleChange,
}) => {
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | null
  >(null);
  const [timer, setTimer] = useState<number>(300);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;

    if (isCodeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsCodeSent(false);
      setTimer(300);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCodeSent, timer]);

  const handleVerificationButtonClick = () => {
    if (!emailVerified) {
      sendVerificationCode();
    }
  };

  const sendVerificationCode = async () => {
    try {
      await checkEmail(email);
      onOpen();
      setIsCodeSent(true);
    } catch {
      showToast("email.sendfail", "email.rightEmail", "error");
    }
  };

  const verifyCode = async () => {
    try {
      await verifyEmail(email, verificationCode);
      setVerificationCodeError(null);
      setEmailVerified(true);
      onClose();
      showToast("email.sendVerify", "email.sendVerifydes", "success");
    } catch {
      setVerificationCodeError(t("signup.invalidVerificationCode"));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <>
      <FormControl isInvalid={!!emailError}>
        <Flex mb={2} align="center">
          <FormLabel htmlFor="email" w="120px" mb={0}>
            {t("signup.email")}
          </FormLabel>
          <Input
            id="email"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t("signup.emailPlaceholder")}
            flex="1"
          />
          <Button
            minW={"90px"}
            onClick={handleVerificationButtonClick}
            bg="#73DA95"
            color="white"
            size="sm"
            ml={2}
            isDisabled={emailVerified}
          >
            {emailVerified
              ? t("signup.emailVerified")
              : t("signup.verifyEmail")}
          </Button>
        </Flex>
        <FormErrorMessage ml={"130px"} mb={2}>
          {emailError}
        </FormErrorMessage>
      </FormControl>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("signup.verifyEmail")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={!!verificationCodeError}>
              <Flex mb={4} align="center" direction={"row"}>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder={t("signup.verificationCodePaceHolder")}
                  flex="1"
                />
              </Flex>
              <Text mt={2} ml={3}>
                {t("signup.codeExpiresIn")} {formatTime(timer)}
              </Text>
              <FormErrorMessage ml={3}>
                {verificationCodeError}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button bg="#73DA95" color="white" mr={3} onClick={verifyCode}>
              {t("signup.verify")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmailSection;
