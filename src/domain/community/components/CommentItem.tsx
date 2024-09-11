import React from "react";
import { Text, Avatar, HStack, Flex } from "@chakra-ui/react";
import { default_img } from "../../../common/utils/img";
import { useNavigate } from "react-router-dom";

interface CommentProps {
  comment_id: number;
  comment_detail: string;
  comment_owner: string;
  owner_img: string | undefined;
  comment_time: string;
}

const CommentItem: React.FC<CommentProps> = ({
  comment_detail,
  comment_owner,
  owner_img,
  comment_time,
}) => {
  const navigate = useNavigate();
  return (
    <HStack spacing="2" align="start" mt={1}>
      <Avatar
        size="xs"
        src={owner_img ? owner_img : default_img}
        cursor={"pointer"}
        onClick={() => {
          navigate(`/${comment_owner}`);
        }}
      />
      <Flex flexDirection={"column"} align="start" w="full">
        <Flex w="full" justifyContent="space-between">
          <Text
            fontSize="sm"
            fontWeight="bold"
            cursor={"pointer"}
            onClick={() => {
              navigate(`/${comment_owner}`);
            }}
          >
            {comment_owner}
          </Text>
          <Text fontSize="xs" color="gray.500" mr={2}>
            {comment_time}
          </Text>
        </Flex>
        <Text fontSize="xs">{comment_detail}</Text>
      </Flex>
    </HStack>
  );
};

export default CommentItem;
