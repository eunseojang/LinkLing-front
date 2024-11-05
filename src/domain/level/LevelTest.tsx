import { useState, useEffect } from "react";
import { VStack, Button, Text, HStack } from "@chakra-ui/react";
import { Language, UserLanguage } from "./utils/LevelUtils";
import { getLevel } from "./api/LevelAPI";
import QuestionTest from "./components.ts/QuestionTest";

const languages: { [key in Language]: string } = {
  KR: "한국어",
  JP: "日本語",
  EN: "English",
  CN: "中文",
}; // Supported languages with native names

function LevelTest() {
  const [userLangs, setUserLangs] = useState<UserLanguage[]>([]);
  const [selectedLang, setSelectedLang] = useState<UserLanguage | null>(null);

  // Fetch user language levels from the API
  useEffect(() => {
    const fetchUserLevels = async () => {
      try {
        const levelsData: UserLanguage[] | null = await getLevel();
        console.log(levelsData);
        const levelsMap: { [key: string]: number } = {
          KR: 0,
          JP: 0,
          EN: 0,
          CN: 0,
        };

        if (levelsData) {
          levelsData.forEach((ul) => {
            levelsMap[ul.user_lang] = ul.lang_level;
          });
        }

        const filteredLangs = Object.keys(languages).map((lang) => ({
          user_lang: lang as Language,
          lang_level: levelsMap[lang as Language],
        }));

        setUserLangs(filteredLangs);
      } catch (error) {
        console.error("Error fetching user levels:", error);
      }
    };

    fetchUserLevels();
  }, []);

  const startTest = (langInfo: UserLanguage) => {
    setSelectedLang(langInfo); // 선택한 언어와 레벨을 상태로 저장
  };

  if (selectedLang) {
    // 선택한 언어에 맞는 레벨 테스트 화면으로 전환
    return (
      <QuestionTest langInfo={selectedLang} setSelectedLang={setSelectedLang} />
    );
  }

  return (
    <VStack
      spacing={4}
      align="stretch"
      width={"500px"}
      margin={"0 auto"}
      draggable={false} // 드래그 비활성화
      style={{ userSelect: "none" }} // 텍스트 선택 비활성화
    >
      {userLangs.length === 0 ? (
        <Text>시험을 볼 언어가 없습니다.</Text>
      ) : (
        userLangs.map((langInfo) => (
          <HStack key={langInfo.user_lang} justifyContent="space-between">
            <Text fontSize="lg" fontWeight="bold">
              {languages[langInfo.user_lang]}{" "}
            </Text>
            <Button
              colorScheme="customGreen"
              variant="outline"
              size="lg"
              borderRadius="md"
              onMouseEnter={(e) =>
                (e.currentTarget.innerText = `${
                  languages[langInfo.user_lang]
                } ${langInfo.lang_level + 1}레벨 테스트 보러가기`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.innerText = `${
                  languages[langInfo.user_lang]
                } ${langInfo.lang_level}레벨`)
              }
              isDisabled={langInfo.lang_level >= 5}
              _hover={{
                bg: "linkling.500",
                color: "white",
              }}
              _disabled={{
                opacity: 0.5,
                cursor: "not-allowed",
              }}
              onClick={() => startTest(langInfo)} // 테스트 시작 함수 연결
            >
              {`${languages[langInfo.user_lang]} ${langInfo.lang_level}레벨`}
            </Button>
          </HStack>
        ))
      )}
    </VStack>
  );
}

export default LevelTest;
