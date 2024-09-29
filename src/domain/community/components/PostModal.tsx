import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import PostCreateForm from "./PostCreateForm";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSubmit: () => void;
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onPostSubmit,
}) => {
  const handleModalClose = () => {
    onClose();
    onPostSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size={"xl"} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>게시물 작성</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PostCreateForm
            onClose={handleModalClose}
            onPostSubmit={onPostSubmit}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
