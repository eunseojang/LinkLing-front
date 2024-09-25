import React, { useState, useEffect, MouseEvent, useRef } from "react";
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
import { detectDominantLanguage } from "../../../common/utils/language";
import { translateText } from "../../../common/utils/translate";
import { useTranslation } from "react-i18next";
import PopoverMenu from "./PopoverMenu";
import { useTextSelection } from "../hooks/useTextSelection";

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
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { selectedText, setMenuPosition, menuPosition, handleTextSelection } =
    useTextSelection(containerRef);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  useEffect(() => {
    if (textToSpeak) {
      const langCode = detectDominantLanguage(textToSpeak);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      speechSynthesis.speak(utterance);
    }
  }, [textToSpeak]);

  const handleTranslateClick = async () => {
    if (selectedText) {
      const translatedText = await translateText(selectedText, i18n.language);
      setTranslatedText(translatedText);
    }
  };

  const handleSpeakClick = () => {
    if (selectedText) {
      setTextToSpeak(selectedText);
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    handleTextSelection();
  };

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
      onMouseUp={handleTextSelection}
      onContextMenu={handleContextMenu}
      position="relative"
      ref={containerRef}
      zIndex="1"
    >
      <HStack padding="10px" spacing="8px">
        <Avatar
          src={user_img || default_img}
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

      {post_img && (
        <Box>
          <Image src={post_img} objectFit="cover" w="100%" />
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

      <PopoverMenu
        menuPosition={menuPosition}
        translatedText={translatedText}
        handleTranslateClick={handleTranslateClick}
        handleSpeakClick={handleSpeakClick}
        closeMenu={() => setMenuPosition(null)}
      />
    </Box>
  );
};

export default FeedItem;
