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
import { BsThreeDotsVertical } from "react-icons/bs";
import { default_img } from "../../../common/utils/img";
import { useNavigate } from "react-router-dom";
import { fetcheImage } from "../../../common/utils/fetchImage";
import { getNicknameToken } from "../../../common/utils/nickname";
import { getRelativeTime } from "../../../common/utils/getRelatevieTime";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { putComment, deleteComment } from "../api/CommetAPI";
import { useTranslation } from "react-i18next";

interface CommentProps {
  comment_id: number;
  comment_detail: string;
  comment_owner_id: string;
  comment_owner_name: string;
  owner_img: string | undefined;
  comment_time: string;
  onCommentChange: (type: string) => void;
}

const CommentItem: React.FC<CommentProps> = ({
  comment_id,
  comment_detail,
  comment_owner_id,
  comment_owner_name,
  owner_img,
  comment_time,
  onCommentChange,
}) => {
  const { t } = useTranslation();
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

  const handleEdit = async () => {
    try {
      await putComment(comment_id, editedComment);
      onEditModalClose();
      onCommentChange("put");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

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
      <HStack spacing="2" align="start" mt={2}>
        <Avatar
          ml={2}
          size="xs"
          src={loadedOwnerImg || default_img}
          cursor={"pointer"}
          onClick={() => {
            navigate(`/${comment_owner_id}`);
          }}
        />
        <Flex flexDirection={"column"} align="start" w="full">
          <Flex w="full" justifyContent="space-between" alignItems={"center"}>
            <Flex alignItems={"center"}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                cursor={"pointer"}
                onClick={() => {
                  navigate(`/${comment_owner_id}`);
                }}
              >
                {comment_owner_name}
              </Text>
              <Text
                ml={0.5}
                fontSize={"14px"}
                color={"gray"}
                cursor={"pointer"}
                onClick={() => navigate(`/${comment_owner_id}`)}
              >
                @{comment_owner_id}
              </Text>
              {comment_owner_id === nickname && (
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
                      {t(`comment.modify`)}
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={onDeleteAlertOpen}>
                      {t(`comment.delete`)}
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
            <Flex alignItems="center">
              <Text fontSize="xs" color="gray.500" mr={2}>
                {getRelativeTime(comment_time)}
              </Text>
            </Flex>
          </Flex>
          <Text fontSize="xs">{comment_detail}</Text>
        </Flex>
      </HStack>

      {/* 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {t(`comment.commentModify`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditModalClose}>
              {t(`comment.cancel`)}
            </Button>
            <Button colorScheme="blue" onClick={handleEdit} ml={3}>
              {t(`comment.modify`)}
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
              {t(`comment.commentDelete`)}
            </AlertDialogHeader>

            <AlertDialogBody>{t(`comment.deleteCheck`)} </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                {t(`comment.cancel`)}
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                {t(`comment.delete`)}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CommentItem;
