import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const useToastMessage = () => {
  const toast = useToast();
  const { t } = useTranslation();

  const showToast = (
    title: string,
    description: string,
    status: "success" | "error" | "warning" | "info"
  ) => {
    toast({
      title: t(title),
      description: t(description),
      status,
      duration: 1500,
      isClosable: true,
    });
  };

  return {
    showToast,
  };
};
