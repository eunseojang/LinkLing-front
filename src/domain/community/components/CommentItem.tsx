import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  Avatar,
  HStack,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs"; // 점 3개 아이콘
import { default_img } from "../../../common/utils/img";
import { useNavigate } from "react-router-dom";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { getNicknameToken } from "../../../common/utils/nickname";
import { getRelativeTime } from "../../../common/utils/getRelatevieTime";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { putComment, deleteComment } from "../api/CommetAPI";

interface CommentProps {
  comment_id: number;
  comment_detail: string;
  comment_owner: string;
  owner_img: string | undefined;
  comment_time: string;
  onCommentChange: (type: string) => void; // New prop for re-fetching comments
}

const CommentItem: React.FC<CommentProps> = ({
  comment_id,
  comment_detail,
  comment_owner,
  owner_img,
  comment_time,
  onCommentChange,
}) => {
  const navigate = useNavigate();
  const [loadedOwnerImg, setLoadedOwnerImg] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState(comment_detail);
  const nickname = getNicknameToken();
  const cancelRef = useRef(null);

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();

  useEffect(() => {
    const loadOwnerImg = async () => {
      if (owner_img) {
        const fetchedOwnerImg = await fetcheImage(owner_img);
        setLoadedOwnerImg(fetchedOwnerImg || default_img);
      } else {
        setLoadedOwnerImg(default_img);
      }
    };
    loadOwnerImg();
  }, [owner_img]);

  // 수정 로직
  const handleEdit = async () => {
    try {
      await putComment(comment_id, editedComment);
      onEditModalClose(); // 모달 닫기
      onCommentChange("put"); // Notify parent to refresh comments
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  // 삭제 로직
  const handleDelete = async () => {
    try {
      await deleteComment(comment_id);
      onDeleteAlertClose(); // 삭제 확인 다이얼로그 닫기
      onCommentChange("delete"); // Notify parent to refresh comments
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <>
      {/* 댓글 아이템 */}
      <HStack spacing="2" align="start" mt={2}>
        <Avatar
          ml={2}
          size="xs"
          src={loadedOwnerImg || default_img}
          cursor={"pointer"}
          onClick={() => {
            navigate(`/${comment_owner}`);
          }}
        />
        <Flex flexDirection={"column"} align="start" w="full">
          <Flex w="full" justifyContent="space-between" alignItems={"center"}>
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
            <Flex alignItems="center">
              <Text fontSize="xs" color="gray.500" mr={2}>
                {getRelativeTime(comment_time)}
              </Text>
              {comment_owner === nickname && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<BsThreeDotsVertical />}
                    variant="ghost"
                    size="xs"
                  />
                  <MenuList fontSize={"md"}>
                    <MenuItem icon={<EditIcon />} onClick={onEditModalOpen}>
                      수정
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={onDeleteAlertOpen}>
                      삭제
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Flex>
          <Text fontSize="xs">{comment_detail}</Text>
        </Flex>
      </HStack>

      {/* 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditModalClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={handleEdit} ml={3}>
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              댓글 삭제
            </AlertDialogHeader>

            <AlertDialogBody>
              정말로 이 댓글을 삭제하시겠습니까?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CommentItem;
