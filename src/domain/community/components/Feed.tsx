import React, { useEffect, useState, useCallback } from "react";
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
import { PostData } from "../utils/FeedUtils";
import PostCreateForm from "./PostCreateForm";
import FeedItem from "./Feeditem";
import { getPost } from "../api/PostAPI";

const Feed: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<PostData[]>([]); // 게시물 데이터 상태
  const [page, setPage] = useState(0); // 페이지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 여부

  // 게시물 데이터 가져오기 함수
  const fetchPost = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const result = await getPost(pageNumber);
      setData((prevData) => [...prevData, ...result]); // 기존 데이터에 추가
      if (result.length === 0) setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 스크롤이 하단에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1); // 페이지 증가
    }
  }, [hasMore, loading]);

  useEffect(() => {
    fetchPost(page); // 페이지가 변경될 때마다 호출
  }, [page, fetchPost]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가
    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, [handleScroll]);

  return (
    <Box width="100%" padding="20px" position="relative">
      <VStack width="100%" spacing="20px">
        {data.map((post) => (
          <FeedItem key={post.post_id} {...post} />
        ))}
        {loading && <p>Loading more posts...</p>} {/* 로딩 상태 표시 */}
        {error && <p>{error}</p>} {/* 에러 메시지 표시 */}
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
