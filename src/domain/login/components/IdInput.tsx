import React from "react";
import { Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface IdInputProps {
  id: string;
  idError: string | null;
  handleIdChange: (value: string) => void;
}

const IdInput: React.FC<IdInputProps> = ({ id, idError, handleIdChange }) => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        placeholder={t(`login.id`)}
        value={id}
        onChange={(e) => handleIdChange(e.target.value)}
        isInvalid={!!idError}
      />
      {idError && (
        <Text fontSize="sm" color="red.500">
          {idError}
        </Text>
      )}
    </>
  );
};

export default IdInput;
