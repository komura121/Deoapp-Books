import React, { useState } from "react";
import { Box, Flex, IconButton, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Product = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsPerPage = useBreakpointValue({ base: 1, md: 3, lg: 6 });

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.ceil(cards.length / cardsPerPage) - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === Math.ceil(cards.length / cardsPerPage) - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <Box position="relative" maxWidth="1360px" mx="auto" overflow="hidden" px="10%">
        <Flex transition="transform 0.5s ease-in-out" transform={`translateX(-${(currentIndex * 100) / cardsPerPage}%)`} width={`${100 * Math.ceil(cards.length / cardsPerPage)}%`}>
          {cards.map((card, index) => (
            <Box
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              mx={4} // Margin between cards
              textAlign="center" // Center align text inside the card
              key={index}
              flex={`0 0 ${100 / cardsPerPage}%`} // Adjust flex basis for responsiveness
              maxW={`${100 / cardsPerPage}%`}
              mb={4}
            >
              <Image src={card.image} alt={card.title} shadow="xl" _hover={{ background: "rgba(0,0,0,0.2)" }} />
              <Box>
                <Text fontWeight="bold" fontSize="md" mb={2}>
                  {card.title}
                </Text>
                <Text fontSize="sm">by {card.author}</Text>
              </Box>
            </Box>
          ))}
        </Flex>
        <IconButton
          aria-label="Previous Slide"
          icon={<FaArrowLeft />}
          position="absolute"
          top="50%"
          left="0"
          transform="translateY(-50%)"
          onClick={prevSlide}
          zIndex="1"
          background="rgba(0,0,0,0.5)"
          color="white"
          _hover={{ background: "rgba(0,0,0,0.8)" }}
        />
        <IconButton
          aria-label="Next Slide"
          icon={<FaArrowRight />}
          position="absolute"
          top="50%"
          right="0"
          transform="translateY(-50%)"
          onClick={nextSlide}
          zIndex="1"
          background="rgba(0,0,0,0.5)"
          color="white"
          _hover={{ background: "rgba(0,0,0,0.8)" }}
        />
      </Box>
    </>
  );
};

export default Product;
