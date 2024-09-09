import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  VStack,
  Text,
  HStack,
  Button,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { PostData, commentsData } from "../utils/FeedUtils";
import { default_img } from "../../../common/utils/img";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput"; // 댓글 입력 컴포넌트 가져오기
import { useNavigate } from "react-router-dom";

const FeedItem: React.FC<PostData> = ({
  post_img,
  post_detail,
  post_owner,
  post_time,
  post_like,
  user_img,
  post_comment,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [textToSpeak, setTextToSpeak] = useState<string | null>(null);
  const [comments, setComments] = useState(commentsData);
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  useEffect(() => {
    if (textToSpeak) {
      const langCode = "ja-JP";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      speechSynthesis.speak(utterance);
    }
  }, [textToSpeak]);

  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      setTextToSpeak(selectedText);
    }
  };

  // 댓글 추가 함수
  const handleCommentSubmit = (newComment: string) => {
    console.log(newComment);
    // const newCommentData = {
    //   comment_id: comments.length + 1,
    //   comment_detail: newComment,
    //   comment_owner: "현재 사용자", // 여기에 현재 사용자 이름 설정
    //   owner_img: null, // 사용자 이미지
    //   comment_time: new Date().toISOString(),
    // };
    // setComments([...comments, newCommentData]);
  };

  return (
    <Box
      borderRadius="md"
      width="600px"
      backgroundColor="white"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      overflow="hidden"
      onMouseUp={handleTextSelection}
    >
      <HStack padding="10px" spacing="8px">
        <Avatar
          src={user_img || default_img}
          cursor={"pointer"}
          onClick={() => {
            navigate(`/${post_owner}`);
          }}
        />
        <VStack align="start" spacing="0" flex="1">
          <Text
            fontWeight="bold"
            cursor={"pointer"}
            onClick={() => {
              navigate(`/${post_owner}`);
            }}
          >
            {post_owner}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {post_time}
          </Text>
        </VStack>
      </HStack>

      {post_img && (
        <Box>
          <Image src={post_img} objectFit="cover" w="100%" />
        </Box>
      )}

      <Box padding="10px">
        <Text mb="5px">{post_detail}</Text>
      </Box>

      <HStack padding="10px" paddingTop="0" justifyContent="space-between">
        <HStack spacing="4">
          <HStack
            spacing="1"
            cursor="pointer"
            _hover={{ color: "red" }}
            onClick={handleClick}
            transition="transform 0.2s ease-in-out"
            transform={isClicked ? "scale(1.2)" : "scale(1)"}
          >
            <Icon as={AiOutlineHeart} boxSize="6" />
            <Text>{post_like}</Text>
          </HStack>
          <HStack
            spacing="1"
            color="black"
            _hover={{ color: "linkling.400" }}
            role="group"
            cursor={"pointer"}
            onClick={() => setShowComments(!showComments)}
          >
            <Icon
              as={AiOutlineMessage}
              boxSize="6"
              _groupHover={{ color: "linkling.400" }}
            />
            <Text
              variant="link"
              _groupHover={{ color: "linkling.400" }}
              fontSize="sm"
            >
              {post_comment}개 댓글 보기
            </Text>
          </HStack>
        </HStack>
      </HStack>

      {showComments && (
        <Box padding="10px" borderTop="1px solid #E2E8F0">
          {comments.map((comment) => (
            <CommentItem key={comment.comment_id} {...comment} />
          ))}

          <CommentInput onCommentSubmit={handleCommentSubmit} />
        </Box>
      )}
    </Box>
  );
};

export default FeedItem;
