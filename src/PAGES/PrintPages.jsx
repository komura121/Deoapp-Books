import React from "react";
import Navbar from "../LAYOUT/Navbar";
import Header from "../LAYOUT/Header";
import Background from "../LAYOUT/Background";
import { Flex, Box, Card, CardHeader, CardBody, CardFooter, Image } from "@chakra-ui/react";
function PrintPages() {
  return (
    <>
      <Navbar />
      <Flex direction="column" pl="6vw" align="center">
        <Box flex="1" width="90%" m={4} boxShadow="xl">
          <Image maxW="100" src="https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png" />
        </Box>
        <Flex gap={4} w="90%" justify="center" bg="red">
          <Box w="50%" align="center" borderWidth={2}>
            kanan
          </Box>
          <Box w="40%" align="center" borderWidth={2}>
            kiri
          </Box>
        </Flex>
      </Flex>
      <Background />
    </>
  );
}

export default PrintPages;
