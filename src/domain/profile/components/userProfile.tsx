import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Flex,
  Spinner,
  Button,
  HStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { FC } from "react";
import "flag-icons/css/flag-icons.min.css"; // Import CSS file
import { getProfile, putProfile } from "../api/ProfileAPI";
import { default_img } from "../../../common/utils/img";
import { getFlagClass, UserProfile } from "../utils/ProfileUtils";
import { uploadImage } from "../../../common/api/Image";
import { useParams } from "react-router-dom";

const UserProfileComponent: FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const toast = useToast();
  const { nickName: id } = useParams<{ nickName: string }>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(id!);
        setProfile({ ...response, profile_info: "FRIEND" });
        setEditedProfile(response);
      } catch (err) {
        setError("존재하지 않는 사용자입니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (editedProfile) {
      try {
        await putProfile(
          id!,
          editedProfile.user_profile,
          editedProfile.user_name,
          editedProfile.user_info,
          editedProfile.user_gender,
          editedProfile.user_nation
        );
        setProfile(editedProfile);
        setIsEditing(false);
        toast({
          title: "Profile updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        setError("Failed to update profile.");
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

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProfile(profile);
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
        setError("Failed to upload image.");
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

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="md" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  if (!profile) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text>No profile data available.</Text>
      </Flex>
    );
  }

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="md"
      w={{ base: "90%", sm: "80%", md: "60%" }}
      margin="auto"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="md"
    >
      <Flex direction="column" align="center" mb={6}>
        <Image
          borderRadius="full"
          boxSize="120px"
          src={editedProfile?.user_profile || default_img}
          alt={editedProfile?.user_name || "Profile Image"}
          mb={4}
        />
        <Text fontSize="2xl" fontWeight="bold" mb={1}>
          {profile.user_name}
        </Text>
        <Text fontSize="md" color="gray.600" mb={2}>
          @{profile.user_id}
        </Text>
        <Text>
          <Badge
            variant="subtle"
            fontSize="sm"
            colorScheme={profile.online ? "green" : "gray"}
          >
            {profile.online ? "온라인" : "오프라인"}
          </Badge>
        </Text>
        <Text fontSize="md" color="gray.600" mb={4}>
          {profile.user_nation && (
            <span
              className={getFlagClass(profile.user_nation)}
              style={{ fontSize: "24px" }}
            ></span>
          )}
        </Text>
      </Flex>
      <Flex justify="space-between" mb={6}>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold">
            {profile.follower}
          </Text>
          <Text fontSize="sm" color="gray.600">
            친구
          </Text>
        </Box>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold">
            {23 || 0}
          </Text>
          <Text fontSize="sm" color="gray.600">
            게시물
          </Text>
        </Box>
      </Flex>
      <Text fontSize="md" textAlign="center" mb={6}>
        Info: {profile.user_info}
      </Text>
      {isEditing ? (
        <>
          <FormControl mb={4}>
            <FormLabel>Upload New Image</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <Button onClick={handleImageUpload} mt={2} colorScheme="teal">
              Upload Image
            </Button>
          </FormControl>
          <Input
            name="user_name"
            value={editedProfile?.user_name || ""}
            onChange={handleChange}
            placeholder="Username"
            mb={2}
          />
          <Input
            name="user_info"
            value={editedProfile?.user_info || ""}
            onChange={handleChange}
            placeholder="Info"
            mb={2}
          />
          <HStack mt={4} justify="center">
            <Button colorScheme="blue" onClick={handleSaveClick}>
              Save
            </Button>
            <Button colorScheme="gray" onClick={handleCancelClick}>
              Cancel
            </Button>
          </HStack>
        </>
      ) : (
        <HStack spacing={4} justify="center">
          {profile.profile_info === "HOST" && (
            <Button colorScheme="orange" onClick={handleEditClick}>
              프로필 수정하기
            </Button>
          )}
          {profile.profile_info === "FRIEND" && (
            <Button colorScheme="blue" onClick={() => alert("Message sent!")}>
              메세지 보내기
            </Button>
          )}
          {profile.profile_info === "PENDING" && (
            <Button colorScheme="yellow" onClick={() => alert("Pending...")}>
              대기중
            </Button>
          )}
          {profile.profile_info === "ACCEPT" && (
            <Button colorScheme="green" onClick={() => alert("Accept friend!")}>
              수락하기
            </Button>
          )}
          {profile.profile_info === "NOTFRIEND" && (
            <Button colorScheme="green" onClick={() => alert("Add friend!")}>
              친구 추가
            </Button>
          )}
        </HStack>
      )}
    </Box>
  );
};

export default UserProfileComponent;
