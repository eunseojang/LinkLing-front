import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  Image,
  Icon,
  Box,
} from "@chakra-ui/react";
import { UserProfile } from "../utils/ProfileUtils";
import { putProfile } from "../api/ProfileAPI";
import { getNicknameToken } from "../../../common/utils/nickname";
import { AiOutlinePicture } from "react-icons/ai";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedProfile: UserProfile | null;
  handleCancelClick: () => void;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  editedProfile,
  handleCancelClick,
}: ProfileEditModalProps) => {
  const id = getNicknameToken();
  const toast = useToast();
  const [profile, setEditedProfile] = useState<UserProfile | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setEditedProfile(editedProfile);
  }, [editedProfile]);

  useEffect(() => {
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newImage]);

  const handleSaveClick = async () => {
    if (profile) {
      try {
        await putProfile(id!, newImage, {
          user_name: profile?.user_name,
          user_info: profile?.user_info,
          user_gender: profile?.user_gender,
          user_nation: profile?.user_nation,
        });

        toast({
          title: "Profile updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Update failed.",
          description: "Unable to update profile.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setEditedProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>프로필 수정하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <Box
              position="relative"
              width="100%"
              height={previewUrl ? "auto" : "50px"}
              display="flex"
              flexDirection={"column"}
              alignItems="center"
              justifyContent="center"
            >
              {previewUrl && (
                <Image
                  src={previewUrl}
                  borderRadius="full"
                  boxSize="150px"
                  alt="Preview"
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
                  {newImage ? "프로필 이미지 변경하기" : "프로필 이미지 업로드"}
                </Button>
              </label>
            </Box>
          </FormControl>
          별명
          <Input
            name="user_name"
            value={profile?.user_name || ""}
            onChange={handleChange}
            placeholder="별명"
            mb={2}
          />
          자기소개
          <Input
            name="user_info"
            value={profile?.user_info || ""}
            onChange={handleChange}
            placeholder="자기소개"
            mb={2}
          />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="blue" onClick={handleSaveClick}>
              저장
            </Button>
            <Button variant="ghost" onClick={handleCancelClick}>
              취소
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileEditModal;
