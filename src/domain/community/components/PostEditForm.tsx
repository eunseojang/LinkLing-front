import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Textarea,
  Button,
  useToast,
  Icon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AiOutlinePicture } from "react-icons/ai";
import { putPost } from "../api/PostAPI"; // import the putPost API

interface PostEditFormProps {
  post_id: number;
  initialDetail: string;
  initialImage?: string | undefined | null;
  onClose: () => void;
}

const PostEditForm: React.FC<PostEditFormProps> = ({
  post_id,
  initialDetail,
  initialImage,
  onClose,
}) => {
  const [postDetail, setPostDetail] = useState(initialDetail);
  const [postImg, setPostImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(
    initialImage || null
  );
  const toast = useToast();

  useEffect(() => {
    // When initial image is changed or provided, set it as the preview
    if (initialImage) {
      setImgPreview(initialImage);
    }
  }, [initialImage]);

  const handleSubmit = async () => {
    if (!postDetail) {
      toast({
        title: "내용을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await putPost(post_id, postImg, { post_detail: postDetail });

      toast({
        title: "게시물이 수정되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose(); // Close the modal after successful submission
      window.location.reload();
    } catch (error) {
      toast({
        title: "게시물 수정에 실패했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImg(file);
      setImgPreview(URL.createObjectURL(file)); // Preview the new image
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>게시물 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="15px" width="100%">
            {/* Image Preview */}
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
                  maxW="300px"
                  maxH="300px"
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
                id="post-image-upload-edit"
              />
              <label htmlFor="post-image-upload-edit">
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

            {/* Post Detail Input */}
            <Textarea
              placeholder="게시물 내용을 작성하세요"
              minH={"200px"}
              value={postDetail}
              onChange={(e) => setPostDetail(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="linkling" onClick={handleSubmit} ml={3}>
            수정
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostEditForm;
