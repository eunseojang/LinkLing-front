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
} from "@chakra-ui/react";
import { UserProfile } from "../utils/ProfileUtils";
import { putProfile } from "../api/ProfileAPI";
import { getNicknameToken } from "../../../common/utils/nickname";
import { useState } from "react";
import { uploadImage } from "../../../common/api/Image";

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
  const [profile, setEditedProfile] = useState<UserProfile | null>(
    editedProfile
  );
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleSaveClick = async () => {
    if (profile) {
      try {
        await putProfile(
          id!,
          profile.user_profile,
          profile.user_name,
          profile.user_info,
          profile.user_gender,
          profile.user_nation
        );
        toast({
          title: "Profile updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose(); // Close modal after save
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
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageUpload = async () => {
    if (newImage) {
      const formData = new FormData();
      formData.append("file", newImage);

      try {
        const response = await uploadImage(formData);
        setEditedProfile((prevProfile) => ({
          ...prevProfile!,
          user_profile: response.imageUrl,
        }));
        toast({
          title: "Image uploaded.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Upload failed.",
          description: "Unable to upload image.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
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
            <FormLabel>프로필 이미지 업로드</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <Button onClick={handleImageUpload} mt={2} colorScheme="teal">
              이미지 업로드
            </Button>
          </FormControl>
          <Input
            name="user_name"
            value={profile?.user_name || ""}
            onChange={handleChange}
            placeholder="이름"
            mb={2}
          />
          <Input
            name="user_info"
            value={profile?.user_info || ""}
            onChange={handleChange}
            placeholder="정보"
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
