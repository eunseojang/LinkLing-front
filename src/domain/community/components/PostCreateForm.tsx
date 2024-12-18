import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  useToast,
  Icon,
  Image,
} from "@chakra-ui/react";
import { AiOutlinePicture } from "react-icons/ai";
import { registerPost } from "../api/PostAPI";

interface PostCreateFormProps {
  onClose: () => void;
  onPostSubmit: () => void; // 게시물 등록 후 호출될 콜백
}

const PostCreateForm: React.FC<PostCreateFormProps> = ({
  onClose,
  onPostSubmit,
}) => {
  const [postDetail, setPostDetail] = useState("");
  const [postImg, setPostImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = () => {
    if (!postDetail) {
      toast({
        title: "내용을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    registerPost(postImg, { post_detail: postDetail });

    toast({
      title: "게시물이 등록되었습니다.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setPostDetail("");
    setPostImg(null);
    setImgPreview(null);

    onPostSubmit(); // 게시물이 등록된 후 피드 리셋
    onClose(); // 모달 닫기
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  return (
    <VStack spacing="15px" width="100%">
      <Box
        position="relative"
        width="100%"
        height={imgPreview ? "auto" : "50px"}
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
      >
        {imgPreview && (
          <Image
            src={imgPreview}
            maxW="500px"
            maxH="500px"
            alt="Preview"
            objectFit="contain"
            borderRadius="md"
            mb="10px"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          display="none"
          id="post-image-upload"
        />
        <label htmlFor="post-image-upload">
          <Button
            as="span"
            width="100%"
            leftIcon={<Icon as={AiOutlinePicture} boxSize="5" />}
            colorScheme="linkling"
            variant="outline"
            borderColor="linkling.400"
          >
            {postImg ? "이미지 변경하기" : "이미지 업로드"}
          </Button>
        </label>
      </Box>

      <Textarea
        placeholder="게시물 내용을 작성하세요"
        minH={"200px"}
        value={postDetail}
        onChange={(e) => setPostDetail(e.target.value)}
      />

      <Button width="100%" colorScheme="linkling" mb={5} onClick={handleSubmit}>
        게시물 등록
      </Button>
    </VStack>
  );
};

export default PostCreateForm;
