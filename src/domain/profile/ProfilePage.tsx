import {
  Box,
  Text,
  Icon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import AppBar from "../../common/components/AppBar/AppBar";
import UserProfileComponent from "./components/userProfile";
import { FaSadTear } from "react-icons/fa"; // 귀여운 아이콘 추가
import { AiOutlinePlus } from "react-icons/ai";
import PostCreateForm from "../community/components/PostCreateForm";
import { getNicknameToken } from "../../common/utils/nickname";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const posts = [];
  const { nickName: id } = useParams<{ nickName: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ishost = id === getNicknameToken();

  return (
    <Box bg={"#F7F9F4"} minH={"100vh"}>
      <AppBar />
      <Box h={"20px"}></Box>
      <Box mt={"60px"}>
        <UserProfileComponent />
      </Box>
      {posts.length === 0 ? (
        <Box
          onClick={() => {
            if (ishost) {
              onOpen();
            }
          }}
          margin={"auto"}
          p={6}
          w={"800px"}
          h={"280px"}
          bg="#F9FAFB"
          borderRadius="md"
          boxShadow="sm"
          border="2px dashed #E2E8F0"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={5}
        >
          <Icon as={FaSadTear} w={10} h={10} color="gray.400" mb={4} />
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            아직 작성한 게시물이 없어요!
          </Text>
          {ishost && (
            <Text fontSize="sm" color="gray.500">
              첫 게시물을 작성해보세요 😊
            </Text>
          )}
        </Box>
      ) : (
        <Box>{/* 게시물 목록을 여기에 추가 */}</Box>
      )}

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

export default ProfilePage;
