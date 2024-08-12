import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToastMessage } from "../../../common/components/useToastMessage";

interface SignUpFormValues {
  id: string;
  email: string;
  password: string;
  correctpassword: string;
  gender: string;
  nationality: string;
  nickname: string;
}

interface SignUpFormErrors {
  idError: string | null;
  emailError: string | null;
  passwordError: string | null;
  correctpasswordError: string | null;
  genderError: string | null;
  nationalityError: string | null;
  nicknameError: string | null;
}

export const useSignUpForm = () => {
  const { t } = useTranslation();
  const { showToast } = useToastMessage();

  const [values, setValues] = useState<SignUpFormValues>({
    id: "",
    email: "",
    password: "",
    correctpassword: "",
    gender: "",
    nationality: "",
    nickname: "",
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({
    idError: null,
    emailError: null,
    passwordError: null,
    correctpasswordError: null,
    genderError: null,
    nationalityError: null,
    nicknameError: null,
  });

  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (field: keyof SignUpFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIdCheck = () => {
    // 아이디 중복 확인 로직 구현
  };

  const validateId = () => {
    const { id } = values;
    const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9.]{5,}$/;

    if (!idRegex.test(id)) {
      setErrors((prev) => ({
        ...prev,
        idError: t("signup.idError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      idError: null,
    }));

    return true;
  };

  const validateEmail = () => {
    const { email } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        emailError: t("signup.emailError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      emailError: null,
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
        passwordError: t("signup.passwordError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      passwordError: null,
    }));

    return true;
  };

  const validateConfirmPassword = () => {
    const { password, correctpassword } = values;

    if (password !== correctpassword) {
      setErrors((prev) => ({
        ...prev,
        correctpasswordError: t("signup.passwordMismatchError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      correctpasswordError: null,
    }));

    return true;
  };

  const validateGender = () => {
    const { gender } = values;

    if (!gender) {
      setErrors((prev) => ({
        ...prev,
        genderError: t("signup.genderError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      genderError: null,
    }));

    return true;
  };

  const validateNationality = () => {
    const { nationality } = values;

    if (!nationality) {
      setErrors((prev) => ({
        ...prev,
        nationalityError: t("signup.nationalityError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      nationalityError: null,
    }));

    return true;
  };

  const validateNickname = () => {
    const { nickname } = values;

    if (nickname.length < 2) {
      setErrors((prev) => ({
        ...prev,
        nicknameError: t("signup.nicknameError"),
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      nicknameError: null,
    }));

    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!emailVerified) {
      showToast("signup.emailVertifyFail", "signup.emailVertifyGo", "error");
      return;
    }

    if (
      !validateEmail() ||
      !validateId() ||
      !validatePassword() ||
      !validateConfirmPassword() ||
      !validateGender() ||
      !validateNationality() ||
      !validateNickname()
    ) {
      showToast("signup.signupFail", "signup.description", "error");
      return;
    }
  };

  return {
    id: values.id,
    email: values.email,
    password: values.password,
    correctpassword: values.correctpassword,
    gender: values.gender,
    nationality: values.nationality,
    nickname: values.nickname,
    idError: errors.idError,
    emailError: errors.emailError,
    passwordError: errors.passwordError,
    correctpasswordError: errors.correctpasswordError,
    genderError: errors.genderError,
    nationalityError: errors.nationalityError,
    nicknameError: errors.nicknameError,
    handleChange,
    emailVerified,
    handleIdCheck,
    setEmailVerified,
    onSubmit,
  };
};
