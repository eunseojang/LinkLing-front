import { useTranslation } from "react-i18next";

export const getRelativeTime = (timeString: string) => {
  const { t } = useTranslation();
  const commentDate = new Date(timeString);
  const now = new Date();
  const diff = (now.getTime() - commentDate.getTime()) / 1000;

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = secondsInDay * 30;
  const secondsInYear = secondsInDay * 365;

  if (diff < secondsInMinute) return `${Math.floor(diff)}` + t(`time.second`);
  if (diff < secondsInHour)
    return `${Math.floor(diff / secondsInMinute)}` + t(`time.minute`);
  if (diff < secondsInDay)
    return `${Math.floor(diff / secondsInHour)}` + t(`time.time`);
  if (diff < secondsInWeek)
    return `${Math.floor(diff / secondsInDay)}` + t(`time.day`);
  if (diff < secondsInMonth)
    return `${Math.floor(diff / secondsInWeek)}` + t(`time.week`);
  if (diff < secondsInYear)
    return `${Math.floor(diff / secondsInMonth)}` + t(`time.month`);

  return `${Math.floor(diff / secondsInYear)}` + t(`time.year`);
};
