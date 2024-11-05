export function detectDominantLanguage(text: string): string {
  const koreanRange = /[\uAC00-\uD7A3]/g;
  const englishRange = /[A-Za-z]/g;
  const japaneseRange = /[\u3040-\u309F\u30A0-\u30FF]/g; // 히라가나와 가타카나만 포함
  const chineseRange = /[\u4E00-\u9FFF]/g;

  const koreanCount = (text.match(koreanRange) || []).length;
  const englishCount = (text.match(englishRange) || []).length;
  const japaneseCount = (text.match(japaneseRange) || []).length;
  const chineseCount = (text.match(chineseRange) || []).length;

  const counts = [
    { language: "ko-KR", count: koreanCount },
    { language: "en-US", count: englishCount },
    { language: "ja-JP", count: japaneseCount },
    { language: "zh-CN", count: chineseCount },
  ];

  counts.sort((a, b) => b.count - a.count);

  return counts[0].count > 0 ? counts[0].language : "ko-KR";
}
