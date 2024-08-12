import { useTranslation } from "react-i18next";
import { LANGUAGES, i18n } from "./locales/i18n";
import { Button, Box, Text } from "@chakra-ui/react";

function App() {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box textAlign="center" fontSize="xl">
      <Text>{t("welcome")}</Text>
      <Button onClick={() => changeLanguage(LANGUAGES.EN)} m={2}>
        English
      </Button>
      <Button onClick={() => changeLanguage(LANGUAGES.KO)} m={2}>
        한국어
      </Button>
      <Button onClick={() => changeLanguage(LANGUAGES.ZH)} m={2}>
        中文
      </Button>
      <Button onClick={() => changeLanguage(LANGUAGES.JA)} m={2}>
        日本語
      </Button>
    </Box>
  );
}

export default App;
