import React, { useEffect, useState, useCallback } from "react";
import { Box, VStack, Button, Icon, useDisclosure } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { PostData } from "../utils/FeedUtils";
import FeedItem from "./Feeditem";
import { getPost } from "../api/PostAPI";
import PostModal from "./PostModal";

const Feed: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<PostData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPost = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const result = await getPost(pageNumber);
      if (pageNumber === 0) {
        setData(result);
        console.log(result);
      } else {
        setData((prevData) => [...prevData, ...result]);
      }
      if (result.length === 0) setHasMore(false);
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    <Box width="100%" padding="20px" position="relative">
      <VStack width="600px" spacing="10px" margin={"auto"}>
        {data.map((post) => (
          <FeedItem key={post.post_id} {...post} />
        ))}
        {loading && <p>Loading more posts...</p>}
        {error && <p>{error}</p>}
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

      <PostModal isOpen={isOpen} onClose={onClose} onPostSubmit={resetFeed} />
    </Box>
  );
};

export default Feed;
