import {
  Box,
  Button,
  Stack,
  Text,
  Checkbox,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useTranslation } from "react-i18next";
import IdInput from "./IdInput";
import PasswordInput from "./PasswordInput";
import { Link as RouterLink } from "react-router-dom";
import { SocialLogin } from "./SocailLogin";

const LoginForm = () => {
  const { t } = useTranslation();

  const {
    id,
    password,
    rememberMe,
    idError,
    passwordError,
    handleIdChange,
    handlePasswordChange,
    toggleRememberMe,
    onSubmit,
  } = useLoginForm();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg={isMobile ? "linkling" : "white"}
      p={8}
      maxW="md"
      w="full"
      borderRadius="3xl"
      margin={"0 auto"}
    >
      <form onSubmit={onSubmit}>
        <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
          {t(`login.login`)}
        </Text>
        <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
          {t(`login.info`)}
        </Text>
        <Stack spacing={4}>
          <IdInput id={id} idError={idError} handleIdChange={handleIdChange} />
          <PasswordInput
            password={password}
            passwordError={passwordError}
            handlePasswordChange={handlePasswordChange}
          />
          <Button type="submit" bg="#73DA95" color="white">
            {t(`login.login`)}
          </Button>
          <Checkbox
            colorScheme="gray"
            isChecked={rememberMe}
            onChange={toggleRememberMe}
            marginLeft={3}
            size="sm"
            fontSize="xs"
            color="gray"
          >
            {t(`login.rememberMe`)}
          </Checkbox>
          <hr />
          <SocialLogin />
          <Stack direction="row" spacing={4} justify="center" mt={4}>
            <Link as={RouterLink} to="/signup" fontSize="xs" color="gray.500">
              {t("signup.signup")}
            </Link>
            <Link
              as={RouterLink}
              to="/findpassword"
              fontSize="xs"
              color="gray.500"
            >
              {t("login.forgotPassword")}
            </Link>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
