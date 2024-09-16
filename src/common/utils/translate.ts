const languageMap: Record<string, string> = {
  "ko": "KO",
  "en": "EN",
  "ja": "JA",
  "zh": "ZH",
};

const getDeepLLanguageCode = (userLangCode: string): string => {
  return languageMap[userLangCode] || "EN";
};

export const translateText = async (text: string, targetLang: string) => {
  const apiKey = "47b17ad1-29bd-4bdc-bb61-30309307aaf9:fx";
  const url = `https://api-free.deepl.com/v2/translate`;

  const deepLLangCode = getDeepLLanguageCode(targetLang);

  const params = new URLSearchParams({
    auth_key: apiKey,
    text,
    target_lang: deepLLangCode,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      body: params,
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error(error);
    return null;
  }
};
