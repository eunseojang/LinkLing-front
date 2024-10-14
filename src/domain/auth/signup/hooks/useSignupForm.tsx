import { useState } from "react";
import { useTranslation } from "react-i18next";
import { register, verifyId } from "../api/SingUpAPI";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
  const [idVerified, setIdVerified] = useState(false);

  const handleChange = (field: keyof SignUpFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "id") setIdVerified(false);
  };

  const handleIdCheck = async () => {
    if (validateId()) {
      try {
        await verifyId(values.id);
        setIdVerified(true);
        showToast("email.idCheck", "email.idCheckdes", "success"); 
      } catch {
        showToast("email.idCheck", "email.idCheckfaildes", "error");
      }
    }
  };

  const validateId = () => {
    const { id } = values;
    const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9._]{5,}$/;

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

    if (!emailVerified) {
      showToast("signup.emailVertifyFail", "signup.emailVertifyGo", "error");
      return;
    }

    if (!idVerified) {
      showToast("signup.idVertifyFail", "signup.idVertifyGo", "error");
      return;
    }

    const response = await register(
      values.id,
      values.password,
      values.email,
      values.nickname,
      values.gender,
      values.nationality
    );

    try {
      if (response) {
        navigate(`/login`, { replace: true });
        showToast("signup.success", "signup.successDescription", "success");
      }
    } catch {
      showToast("signup.fail", "signup.failDescription", "error");
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
    idVerified,
  };
};
