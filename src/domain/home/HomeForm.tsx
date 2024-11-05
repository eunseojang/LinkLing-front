import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MatchingCard from "./MatingCard";
import MatchingCard2 from "./MatingCard2";

export default function HomeForm() {
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const slides = [
    {
      title: t("home.carousel.global.title"),
      description: t("home.carousel.global.description"),
      image: "/home1.png",
      buttonText: t("home.carousel.global.buttonText"),
    },
    {
      title: t("home.carousel.translation.title"),
      description: t("home.carousel.translation.description"),
      image: "/home3.png",
      buttonText: t("home.carousel.translation.buttonText"),
    },
    {
      title: t("home.carousel.level.title"),
      description: t("home.carousel.level.description"),
      image: "/home2.png",
      buttonText: t("home.carousel.level.buttonText"),
    },
  ];

  const handlePrev = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      {/* Carousel */}
      <Box
        position="relative"
        height={{ base: "50vh", md: "70vh", lg: "80vh" }}
        overflow="hidden"
      >
        <Flex
          width="100%"
          height="100%"
          transition="transform 0.5s ease-in-out"
          transform={`translateX(-${slideIndex * 100}%)`}
        >
          {slides.map((slide, index) => (
            <Box key={index} flex="0 0 100%" position="relative">
              <Image
                src={slide.image}
                alt={slide.title}
                objectFit="cover"
                width="100%"
                height="100%"
              />
              <Box
                position="absolute"
                top="50%"
                left={{ base: "5%", md: "10%" }}
                transform="translateY(-50%)"
                color="white"
                maxWidth={{ base: "90%", md: "70%" }}
                padding={5}
              >
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  mb={4}
                >
                  {slide.title}
                </Heading>
                <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} mb={4}>
                  {slide.description}
                </Text>
                <Button size={{ base: "sm", md: "md" }} colorScheme="linkling">
                  {slide.buttonText}
                </Button>
              </Box>
            </Box>
          ))}
        </Flex>
        <IconButton
          aria-label="Previous Slide"
          icon={<ArrowBackIcon />}
          position="absolute"
          top="50%"
          left="10px"
          transform="translateY(-50%)"
          onClick={handlePrev}
        />
        <IconButton
          aria-label="Next Slide"
          icon={<ArrowForwardIcon />}
          position="absolute"
          top="50%"
          right="10px"
          transform="translateY(-50%)"
          onClick={handleNext}
        />
      </Box>

      <VStack
        paddingX={{ base: "20px", md: "50px", lg: "100px" }}
        my={isMobile ? "20px" : "40px"}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          width="100%"
          wrap="wrap"
        >
          <MatchingCard
            icon="📚"
            heading={t("home.features.customLearning.heading")}
            description={t("home.features.customLearning.description")}
          />
          <MatchingCard
            icon="🔀"
            heading={t("home.features.randomMatching.heading")}
            description={t("home.features.randomMatching.description")}
          />
          <MatchingCard
            icon="🌏"
            heading={t("home.features.culturalExchange.heading")}
            description={t("home.features.culturalExchange.description")}
          />
        </Flex>
      </VStack>

      <VStack spacing="30px">
        <Flex
          direction="column"
          justifyContent="center"
          alignItems={"center"}
          wrap="wrap"
          w={isMobile ? "300px" : "700px"}
        >
          <MatchingCard2
            icon="🎙️"
            heading={t("home.additionalFeatures.pronunciationTest.heading")}
            description={t(
              "home.additionalFeatures.pronunciationTest.description"
            )}
          />
          <MatchingCard2
            icon="💬"
            heading={t("home.additionalFeatures.realTimeTranslation.heading")}
            description={t(
              "home.additionalFeatures.realTimeTranslation.description"
            )}
          />
          <MatchingCard2
            icon="🎮"
            heading={t("home.additionalFeatures.unityChat.heading")}
            description={t("home.additionalFeatures.unityChat.description")}
          />
        </Flex>
      </VStack>

      <VStack
        spacing={isMobile ? "30px" : "60px"}
        padding={"10px"}
        mb={isMobile ? "30px" : "60px"}
      >
        <Box
          textAlign="center"
          w={isMobile ? "300px" : "1000px"}
          padding="30px"
          border="1px solid #E2E8F0"
          borderRadius="20px"
          backgroundColor="white"
          position="relative"
          _after={{
            content: '""',
            position: "absolute",
            width: "50px",
            height: "5px",
            background: "linear-gradient(90deg, #73DA95, #C6F6D5)",
            bottom: "-15px",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "2px",
          }}
        >
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            mb="20px"
            color="#73DA95"
          >
            {t("home.about.features.title")}
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="customBlack"
            lineHeight="tall"
          >
            {t("home.about.features.description")}
          </Text>
        </Box>
        <Box
          textAlign="center"
          w={isMobile ? "300px" : "1000px"}
          padding="30px"
          border="1px solid #E2E8F0"
          borderRadius="20px"
          backgroundColor="white"
          position="relative"
          _after={{
            content: '""',
            position: "absolute",
            width: "50px",
            height: "5px",
            background: "linear-gradient(90deg, #73DA95, #C6F6D5)",
            bottom: "-15px",
            left: "50%", // ... (이전 코드에 이어서)
            transform: "translateX(-50%)",
            borderRadius: "2px",
          }}
        >
          <Heading
            fontSize={{ base: "xl", md: "2xl" }}
            mb="20px"
            color="#73DA95"
          >
            {t("home.about.future.title")}
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="customBlack"
            lineHeight="tall"
          >
            {t("home.about.future.description")}
          </Text>
        </Box>
      </VStack>

      {/* Footer */}
      <Box as="footer" padding="20px" backgroundColor="#333333">
        <Box textAlign="center">
          <Text color={"#111111"}>
            {t("home.footer.copyright")} <br />
            {t("home.footer.department")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
