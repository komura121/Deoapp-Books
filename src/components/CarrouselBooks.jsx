import React from "react";
import usePageStore from "../../config/usePageStore";

function CarrouselBooks() {
  const { currentIndex, setCurrentIndex } = usePageStore();
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="center">
        <IconButton aria-label="Previous" icon={<ChevronLeftIcon />} onClick={handlePrev} mr={4} />
        <Box>
          <Image src={items[currentIndex].coverImg} alt={items[currentIndex].heading} w="180px" h="250px" objectFit="cover" />
          <Text fontWeight="600" fontSize="md" textAlign="center" mt={4}>
            {items[currentIndex].heading}
          </Text>
          <Flex justifyContent="center" mt={2}>
            <Tag colorScheme="blue" size="sm">
              {items[currentIndex].category}
            </Tag>
            <Tag colorScheme="green" size="sm" ml={2}>
              {items[currentIndex].label}
            </Tag>
          </Flex>
          <Text fontSize="8px" color="teal" textAlign="center">
            author: {items[currentIndex].pemilik}
          </Text>
        </Box>
        <IconButton aria-label="Next" icon={<ChevronRightIcon />} onClick={handleNext} ml={4} />
      </Flex>
    </>
  );
}

export default CarrouselBooks;
