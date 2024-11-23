import { useWebSocket } from "./WebSocketContext";
import {
  Text,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

const NotificationBar = () => {
  const { notifications, toUserId, socket } = useWebSocket();
  const lastNotification = notifications[notifications.length - 1];

  const { isOpen, onOpen, onClose } = useDisclosure();

  // 모달을 열기 위해 currentNotification이 바뀌는 것을 감지
  useEffect(() => {
    if (lastNotification) {
      onOpen();
    }
  }, [notifications, onOpen]);

  const handleResponse = (response: "Accepted" | "Rejected") => {
    if (socket && lastNotification && toUserId) {
      socket.send(`RESPONSE:TO:${toUserId}|MESSAGE:${response}`);
      console.log(`Response sent: ${response}`);
      onClose(); // 모달 닫기
    } else {
      console.error("No currentNotification or toUserId available.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Notification</ModalHeader>
          <ModalBody>
            <Text>{lastNotification}</Text>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => handleResponse("Accepted")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleResponse("Rejected")}
              >
                Reject
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NotificationBar;
