import React, { useState } from "react";
import { HStack, Input, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface CommentInputProps {
  onCommentSubmit: (comment: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onCommentSubmit }) => {
  const { t } = useTranslation();

  const [comment, setComment] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim() !== "") {
      onCommentSubmit(comment);
      setComment("");
    }
  };

  return (
    <HStack mt="2" spacing="2">
      <Input
        height={"30px"}
        fontSize={"12px"}
        placeholder={t(`comment.placeHolder`) + "..."}
        value={comment}
        onChange={handleInputChange}
        flex="1"
      />
      <Button
        fontSize={"12px"}
        colorScheme="linkling"
        h={"30px"}
        onClick={handleSubmit}
      >
        {t(`comment.send`)}
      </Button>
    </HStack>
  );
};

export default CommentInput;
