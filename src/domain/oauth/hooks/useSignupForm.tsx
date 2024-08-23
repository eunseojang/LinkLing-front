import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToastMessage } from "../../../common/components/useToastMessage";

interface OauthSignUpFormValues {
  id: string;
  gender: string;
  nationality: string;
  nickname: string;
}

interface OauthSignUpFormErrors {
  idError: string | null;
  genderError: string | null;
  nationalityError: string | null;
  nicknameError: string | null;
}

export const useOauthSignUpForm = () => {
  const { t } = useTranslation();
  const { showToast } = useToastMessage();

  const [values, setValues] = useState<OauthSignUpFormValues>({
    id: "",
    gender: "",
    nationality: "",
    nickname: "",
  });

  const [errors, setErrors] = useState<OauthSignUpFormErrors>({
    idError: null,
    genderError: null,
    nationalityError: null,
    nicknameError: null,
  });

  const [idVerified, setIdVerified] = useState(false);

  const handleChange = (field: keyof OauthSignUpFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "id") setIdVerified(false);
  };

  const handleIdCheck = () => {
    if (validateId()) {
      setIdVerified(true);
    }
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
      !validateId() ||
      !validateGender() ||
      !validateNationality() ||
      !validateNickname()
    ) {
      showToast("signup.signupFail", "signup.description", "error");
      return;
    }

    if (!idVerified) {
      showToast("signup.idVertifyFail", "signup.idVertifyGo", "error");
      return;
    }
  };

  return {
    id: values.id,
    nickname: values.nickname,
    idError: errors.idError,
    genderError: errors.genderError,
    nationalityError: errors.nationalityError,
    nicknameError: errors.nicknameError,
    handleChange,
    handleIdCheck,
    onSubmit,
    idVerified,
  };
};
