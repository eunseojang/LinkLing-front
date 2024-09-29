export const getRelativeTime = (timeString: string) => {
  const commentDate = new Date(timeString);
  const now = new Date();
  const diff = (now.getTime() - commentDate.getTime()) / 1000; // 초 단위 시간 차이

  if (diff < 60) return `${Math.floor(diff)}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  return `${Math.floor(diff / 604800)}주 전`;
};
