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
import MatchingCard from "./MatingCard";
import MatchingCard2 from "./MatingCard2";

const slides = [
  {
    title: "🌐 글로벌 커뮤니티",
    description: "다양한 문화와 언어를 가진 사람들과 함께 배우세요.",
    image: "/home1.jpg",
    buttonText: "커뮤니티 참여",
  },
  {
    title: "🌍 실시간 번역",
    description: "실시간 번역으로 언어 장벽 없이 전 세계 사람들과 소통하세요.",
    image: "/home3.png",
    buttonText: "지금 시작하기",
  },
  {
    title: "🎙️ 발음 측정 테스트",
    description:
      "당신의 발음을 들어보고 상대방에게 제대로 전달될 수 있는 레벨인지 확인합니다.",
    image: "/home2.png",
    buttonText: "테스트 시작",
  },
];

export default function HomeForm() {
  const [slideIndex, setSlideIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

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
            heading="맞춤형 대화학습"
            description="당신의 언어 레벨에 맞춘 상대방 매칭을 통해 더 효율적인 학습 환경을 제공해드립니다."
          />
          <MatchingCard
            icon="🔀"
            heading="랜덤 매칭"
            description="전 세계 사용자들과 랜덤 매칭을 통해 새로운 친구를 만나고, 언어를 배우세요."
          />
          <MatchingCard
            icon="🌏"
            heading="문화 교류"
            description="새로운 사람들과의 만남을 통해 다양한 문화를 경험하세요."
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
            heading="발음 측정 테스트"
            description="LinkLing의 발음 측정 테스트로 여러분의 언어 실력을 한 단계 더 높여보세요."
          />
          <MatchingCard2
            icon="💬"
            heading="실시간 번역 및 발음 확인"
            description="LinkLing의 실시간 Api를 활용한 번역 기능으로 언어의 장벽을 허물어보세요."
          />
          <MatchingCard2
            icon="🎮"
            heading="유니티 환경 링(채팅)"
            description="LinkLing의 유니티 기반 가상 환경에서 몰입감 있는 채팅 경험을 즐겨보세요."
          />
        </Flex>
      </VStack>

      {/* Details Section */}
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
            LinkLing의 특징
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="customBlack"
            lineHeight="tall"
          >
            LinkLing은 유니티 기반 환경에서 사용자들이 다양한 국적의 사람들과
            실시간으로 소통하며 언어를 학습할 수 있는 플랫폼입니다.
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
            언어 학습의 미래
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="customBlack"
            lineHeight="tall"
          >
            LinkLing과 함께라면 언어학습의 한계는 없습니다.
          </Text>
        </Box>
      </VStack>

      {/* Footer */}
      <Box as="footer" padding="20px" backgroundColor="#333333">
        <Box textAlign="center">
          <Text color={"#111111"}>
            © 2024 LinkLing. 010-1111-2222. (주) 링크링 <br />
            창의융합프로젝트1 금오공과대학교 컴퓨터웨어소프트웨어공학과
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
