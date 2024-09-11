import React, { useState } from "react";
import { HStack, Input, Button } from "@chakra-ui/react";

interface CommentInputProps {
  onCommentSubmit: (comment: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onCommentSubmit }) => {
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
        placeholder="댓글을 입력하세요..."
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
        댓글 달기
      </Button>
    </HStack>
  );
};

export default CommentInput;
