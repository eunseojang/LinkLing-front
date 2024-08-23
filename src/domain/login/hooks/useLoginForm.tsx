import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHandleLogin } from "./useHandleLogin";
import { useToastMessage } from "../../../common/components/useToastMessage";
import { useLoginUser } from "../api/LoginAPI";

interface LoginFormValues {
  id: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  idError: string | null;
  passwordError: string | null;
}

export const useLoginForm = () => {
  const { t } = useTranslation();
  const handleLogin = useHandleLogin();
  const { showToast } = useToastMessage();
  const { loginUser } = useLoginUser();
  const [values, setValues] = useState<LoginFormValues>({
    id: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    idError: null,
    passwordError: null,
  });

  const handleIdChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      id: value,
    }));
  };

  const handlePasswordChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const toggleRememberMe = () => {
    setValues((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const validateId = () => {
    const { id } = values;

    const idRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!idRegex.test(id)) {
      setErrors((prev) => ({
        ...prev,
        idError: t("login.emailError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      idError: null,
    }));

    return true;
  };

  const validatePassword = () => {
    const { password } = values;
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

    if (!regex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        passwordError: t("login.passwordError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      passwordError: null,
    }));

    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.id || !values.password) {
      showToast("login.loginFail", "login.description", "error");
      return;
    }

    if (validateId() && validatePassword()) {
      const { access_token, refresh_token } = await loginUser({
        id: values.id,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      try {
        if (access_token && refresh_token) {
          await handleLogin(access_token, refresh_token);
        }
      } catch {
        showToast("login.failTitle", "login.loginError", "error");
      }
    }
  };

  return {
    id: values.id,
    password: values.password,
    rememberMe: values.rememberMe,
    idError: errors.idError,
    passwordError: errors.passwordError,
    handleIdChange,
    handlePasswordChange,
    toggleRememberMe,
    onSubmit,
  };
};
