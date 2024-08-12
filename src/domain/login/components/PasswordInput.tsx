import React, { useState } from "react";
import {
  Input,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from "react-i18next";

interface PasswordInputProps {
  password: string;
  passwordError: string | null;
  handlePasswordChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  passwordError,
  handlePasswordChange,
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t(`login.password`)}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          isInvalid={!!passwordError}
          autoComplete="current-password"
          id="password"
        />
        <InputRightElement width="3rem">
          <IconButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            icon={showPassword ? <HiEyeOff /> : <HiEye />}
            color="gray"
            variant="ghost"
            onClick={togglePasswordVisibility}
            h="1.75rem"
          />
        </InputRightElement>
      </InputGroup>
      {passwordError && (
        <Text fontSize="sm" color="red.500">
          {passwordError}
        </Text>
      )}
    </>
  );
};

export default PasswordInput;
