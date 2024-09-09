import React, { useState } from "react";
import {
  Box,
  VStack,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { feedData } from "../utils/FeedUtils";
import PostCreateForm from "./PostCreateForm";
import FeedItem from "./Feeditem";

const Feed: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box width="100%" padding="20px" position="relative">
      <VStack width="100%" spacing="20px">
        {feedData.map((post) => (
          <FeedItem key={post.post_id} {...post} />
        ))}
      </VStack>

      <Button
        onClick={onOpen}
        position="fixed"
        bottom="20px"
        right="20px"
        borderRadius="50%"
        width="60px"
        height="60px"
        backgroundColor="linkling.400"
        color="white"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        _hover={{ backgroundColor: "linkling" }}
      >
        <Icon as={AiOutlinePlus} boxSize="6" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 작성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PostCreateForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Feed;
