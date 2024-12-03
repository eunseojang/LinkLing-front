import React, { useEffect, useState } from "react";
import {
  Text,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { getAlarm } from "../../api/alarm";
import { alarmCheck } from "../../api/alarm";

// 알림 데이터 타입 정의
interface Notification {
  notification_id: number;
  notification_content: string;
  notification_status: boolean; // 읽은 상태 (true: 읽음, false: 안 읽음)
}

const AlarmDropdown: React.FC = () => {
  const [alarms, setAlarms] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 드롭다운 상태
  const { t } = useTranslation();

  const fetchAlarms = async () => {
    try {
      setLoading(true);
      const data: Notification[] = await getAlarm();
      setAlarms(data);

      // 새로운 알림 여부 확인
      const unreadAlarms = data.some((alarm) => !alarm.notification_status);
      setHasNew(unreadAlarms);
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) {
      const intervalId = setInterval(fetchAlarms, 1000);
      return () => clearInterval(intervalId); // 클린업
    }
  }, [isMenuOpen]);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleAlarmClick = async (notification_id: number) => {
    try {
      // 알람 상태 업데이트 (읽음으로 표시)
      await alarmCheck(notification_id);

      // 업데이트 후 알람 목록 새로 고침
      const data = await getAlarm();
      setAlarms(data);

      // 새로운 알람 여부 다시 확인
      const unreadAlarms = data.some((alarm: any) => !alarm.notification_status);
      setHasNew(unreadAlarms);
    } catch (error) {
      console.error("Failed to update alarm status:", error);
    }
  };

  return (
    <Menu onOpen={handleMenuOpen} onClose={handleMenuClose}>
      <MenuButton
        as={Button}
        border="none"
        aria-label="Alarm"
        variant="outline"
        display="flex"
        padding="10px"
      >
        <Flex align="center" position="relative">
          <BellIcon boxSize="20px" />
          {hasNew && (
            <Box
              w="8px"
              h="8px"
              bg="red.500"
              borderRadius="full"
              position="absolute"
              top="-2px"
              right="-2px"
            />
          )}
        </Flex>
      </MenuButton>

      <MenuList>
        {loading ? (
          <MenuItem>
            <Spinner size="sm" mr={2} />
            {t("loading")}
          </MenuItem>
        ) : alarms.length > 0 ? (
          alarms.map((alarm) => (
            <MenuItem
              key={alarm.notification_id}
              onClick={() => handleAlarmClick(alarm.notification_id)} // 알람 클릭 시 상태 변경
              backgroundColor={
                alarm.notification_status ? "gray.100" : "red.50"
              } // 읽은 알람은 회색 배경, 읽지 않은 알람은 빨간 배경
            >
              <Text
                fontSize="sm"
                fontWeight={alarm.notification_status ? "normal" : "bold"}
              >
                {alarm.notification_content}
              </Text>
              {!alarm.notification_status && (
                <Box
                  w="8px"
                  h="8px"
                  bg="red.500"
                  borderRadius="full"
                  position="absolute"
                  top="10px"
                  right="10px"
                />
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem>{t("menu.noAlarms")}</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default AlarmDropdown;
