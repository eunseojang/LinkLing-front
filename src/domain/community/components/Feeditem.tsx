import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Image,
  VStack,
  Text,
  HStack,
  Avatar,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs"; // 점 3개 아이콘
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"; // 수정/삭제 아이콘
import { PostData } from "../utils/FeedUtils";
import { default_img } from "../../../common/utils/img";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useNavigate } from "react-router-dom";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { postLikes } from "../api/PostAPI";
import { getRelativeTime } from "../../../common/utils/getRelatevieTime";
import { getNicknameToken } from "../../../common/utils/nickname"; // nickname 가져오기
import { getComment, postComment } from "../api/CommetAPI";
import { deletePost } from "../api/PostAPI"; // API for deleting the post
import PostEditForm from "./PostEditForm"; // Import the PostEditForm for editing
import { useTranslation } from "react-i18next";

const FeedItem: React.FC<PostData> = ({
  post_id,
  post_img,
  post_detail,
  post_owner_id,
  post_owner_name,
  post_time,
  post_like,
  user_img,
  post_comment,
}) => {
  const { t } = useTranslation();
  const [loadedPostImg, setLoadedPostImg] = useState<string | null>(null);
  const [loadedUserImg, setLoadedUserImg] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [likes, setLikes] = useState(post_like);
  const [commentCount, setCommentCount] = useState(post_comment);
  const [isClicked, setIsClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 페이지 번호 상태
  const [hasMoreComments, setHasMoreComments] = useState(true); // 더 많은 댓글이 있는지 여부
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null); // Ref for the delete confirmation
  const navigate = useNavigate();
  const nickname = getNicknameToken(); // nickname 토큰 가져오기

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

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  const fetchComments = async (page: number) => {
    setIsLoadingComments(true);
    try {
      const fetchedComments = await getComment(post_id, 10, page); // 페이지에 따라 댓글 요청
      if (fetchedComments.length < 10) {
        setHasMoreComments(false); // 더 이상 댓글이 없으면 false로 설정
      }
      setComments((prevComments) => [...prevComments, ...fetchedComments]); // 이전 댓글에 새로운 댓글 추가
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleFetchComments = () => {
    setCurrentPage(0);
    setComments([]);
    if (!showComments) {
      fetchComments(0); // 페이지 0부터 댓글 가져오기
    }
    setShowComments(!showComments);
  };

  const handleCommentChange = (type: string) => {
    setCurrentPage(0);
    setComments([]);
    fetchComments(0);
    if (type === "post") setCommentCount((prevCount) => prevCount + 1);
    if (type === "delete") setCommentCount((prevCount) => prevCount - 1);
  };

  const handleCommentSubmit = async (newComment: string) => {
    try {
      await postComment(post_id, newComment);
      handleCommentChange("post"); // 댓글 작성 후 처음부터 다시 불러오기
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  // 좋아요 클릭
  const handleLikeClick = async () => {
    try {
      await postLikes(post_id);
      setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  // 댓글 무한 스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMoreComments && !isLoadingComments) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchComments(nextPage); // 다음 페이지의 댓글 불러오기
    }
  }, [currentPage, hasMoreComments, isLoadingComments]);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (bottom && showComments && hasMoreComments) {
        handleLoadMore(); // 스크롤이 끝에 도달하면 다음 페이지 로드
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleLoadMore, showComments, hasMoreComments]);

  // 삭제 처리
  const handleDeletePost = async () => {
    try {
      await deletePost(post_id); // Call API to delete the post
      onDeleteAlertClose(); // Close the alert
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <>
      <Box
        borderRadius="xl"
        width="100%"
        backgroundColor="white"
        boxShadow="xs"
        overflow="hidden"
        position="relative"
        zIndex="1"
        borderColor="gray.200"
      >
        <HStack padding="10px" spacing="8px">
          <Avatar
            src={loadedUserImg || default_img}
            cursor={"pointer"}
            onClick={() => navigate(`/${post_owner_id}`)}
          />
          <VStack align="start" spacing="0" flex="1">
            <Flex alignItems={"end"}>
              <Text
                fontWeight="bold"
                cursor={"pointer"}
                onClick={() => navigate(`/${post_owner_id}`)}
              >
                {post_owner_name}
              </Text>
              <Text
                ml={0.5}
                fontSize={"14px"}
                color={"gray"}
                cursor={"pointer"}
                onClick={() => navigate(`/${post_owner_id}`)}
              >
                @{post_owner_id}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500">
              {getRelativeTime(post_time)}
            </Text>
          </VStack>
          {post_owner_id === nickname && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem
                  icon={<EditIcon />}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  {t(`comment.modify`)}
                </MenuItem>
                <MenuItem icon={<DeleteIcon />} onClick={onDeleteAlertOpen}>
                  {t(`comment.delete`)}
                </MenuItem>
              </MenuList>
            </Menu>
          )}
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
              onClick={() => {
                handleClick();
                handleLikeClick();
              }}
              transition="transform 0.2s ease-in-out"
              transform={isClicked ? "scale(1.2)" : "scale(1)"}
            >
              <Icon as={AiOutlineHeart} boxSize="6" />
              <Text>{likes}</Text>
            </HStack>
            <HStack
              spacing="1"
              color="black"
              _hover={{ color: "linkling.400" }}
              role="group"
              cursor={"pointer"}
              onClick={handleFetchComments}
            >
              <Icon as={AiOutlineMessage} boxSize="6" />
              <Text variant="link" _groupHover={{ color: "linkling.400" }}>
                {commentCount
                  ? `${commentCount}` + t(`comment.see`)
                  : t(`comment.write`)}
              </Text>
            </HStack>
          </HStack>
        </HStack>

        {showComments && (
          <Box
            paddingX={2}
            paddingTop={commentCount ? "5px" : "2px"}
            paddingBottom="10px"
            borderTop="1px solid #E2E8F0"
          >
            {isLoadingComments && <Spinner />}
            {comments.map((comment) => (
              <CommentItem
                key={comment.comment_id}
                {...comment}
                onCommentChange={handleCommentChange}
              />
            ))}
            <CommentInput onCommentSubmit={handleCommentSubmit} />
          </Box>
        )}
      </Box>

      {/* Post Edit Modal */}
      {isEditModalOpen && (
        <PostEditForm
          post_id={post_id}
          initialDetail={post_detail}
          initialImage={loadedPostImg}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Post Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t(`post.postDelete`)}
            </AlertDialogHeader>
            <AlertDialogBody>{t(`post.deleteCheck`)}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                {t(`comment.cancel`)}
              </Button>
              <Button colorScheme="red" onClick={handleDeletePost} ml={3}>
                {t(`comment.delete`)}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default FeedItem;
