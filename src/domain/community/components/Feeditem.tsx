import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  VStack,
  Text,
  HStack,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { PostData, commentsData } from "../utils/FeedUtils";
import { default_img } from "../../../common/utils/img";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useNavigate } from "react-router-dom";
import { fetcheImage } from "../../../common/utils/fetchImage";

const FeedItem: React.FC<PostData> = ({
  post_img,
  post_detail,
  post_owner,
  post_time,
  post_like,
  user_img,
  post_comment,
}) => {
  const [loadedPostImg, setLoadedPostImg] = useState<string | null>(null); // 포스트 이미지 상태
  const [loadedUserImg, setLoadedUserImg] = useState<string | null>(null); // 유저 이미지 상태

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(commentsData);
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  useEffect(() => {
    const loadImages = async () => {
      if (post_img) {
        const fetchedPostImg = await fetcheImage(post_img);
        setLoadedPostImg(fetchedPostImg);
      }
      if (user_img) {
        const fetchedUserImg = await fetcheImage(user_img);
        setLoadedUserImg(fetchedUserImg || default_img);
      } else {
        setLoadedUserImg(default_img);
      }
    };

    loadImages();
  }, [post_img, user_img]);

  const handleCommentSubmit = (newComment: string) => {
    setComments([
      ...comments,
      {
        comment_id: 10,
        comment_detail: newComment,
        comment_owner: "정메교",
        owner_img: undefined,
        comment_time: "2024-08-25",
      },
    ]);
  };

  return (
    <Box
      borderRadius="md"
      width="700px"
      backgroundColor="white"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      overflow="hidden"
      position="relative"
      zIndex="1"
    >
      <HStack padding="10px" spacing="8px">
        <Avatar
          src={loadedUserImg || default_img}
          cursor={"pointer"}
          onClick={() => navigate(`/${post_owner}`)}
        />
        <VStack align="start" spacing="0" flex="1">
          <Text
            fontWeight="bold"
            cursor={"pointer"}
            onClick={() => navigate(`/${post_owner}`)}
          >
            {post_owner}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {post_time}
          </Text>
        </VStack>
      </HStack>

      {loadedPostImg && (
        <Box>
          <Image src={loadedPostImg} objectFit="cover" w="100%" />
        </Box>
      )}

      <Box padding="10px">
        <Text mb="5px" id="post-detail">
          {post_detail}
        </Text>
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
