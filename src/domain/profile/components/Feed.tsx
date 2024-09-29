import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  VStack,
  Button,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import FeedItem from "../../community/components/Feeditem";
import PostModal from "../../community/components/PostModal";
import { PostData } from "../../community/utils/FeedUtils";
import { useParams } from "react-router-dom";
import { getPost } from "../api/PostAPI";
import { FaSadTear } from "react-icons/fa";
import { getNicknameToken } from "../../../common/utils/nickname";

const Feed: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<PostData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { nickName } = useParams<{ nickName: string }>();
  const isHost = nickName === getNicknameToken();

  const fetchPost = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError(null); // 새로운 데이터 요청 시 에러 초기화

      try {
        if (nickName) {
          const result = await getPost(nickName, pageNumber);
          if (pageNumber === 0) {
            setData(result);
          } else {
            setData((prevData) => [...prevData, ...result]);
          }
          if (result.length === 0) setHasMore(false);
        }
      } catch (error) {
        setError("게시물을 가져오는 데 실패했습니다. 다시 시도해 주세요.");
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [nickName]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    fetchPost(page);
  }, [page, fetchPost]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const resetFeed = () => {
    setPage(0);
    setData([]);
    fetchPost(0);
  };

  return (
    <Box width="100%" padding="20px" position="relative" mt={-2}>
      <VStack width="800px" spacing="10px" margin={"auto"}>
        {data.map((post) => (
          <FeedItem key={post.post_id} {...post} />
        ))}
        {loading && <p>게시물을 로딩 중...</p>}
        {error && <p>{error}</p>}
      </VStack>
      {data.length === 0 && (
        <Box
          margin="auto"
          p={6}
          w="800px"
          h="240px"
          bg="#F9FAFB"
          borderRadius="2xl"
          boxShadow="sm"
          border="2px dashed #E2E8F0"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={2}
        >
          <Icon as={FaSadTear} w={10} h={10} color="gray.400" mb={4} />
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            아직 작성한 게시물이 없어요!
          </Text>
          {isHost && (
            <Text fontSize="sm" color="gray.500">
              첫 게시물을 작성해보세요 😊
            </Text>
          )}
        </Box>
      )}
      {isHost && (
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
      )}

      <PostModal isOpen={isOpen} onClose={onClose} onPostSubmit={resetFeed} />
    </Box>
  );
};

export default Feed;
