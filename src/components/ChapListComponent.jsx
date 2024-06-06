import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Spacer,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Box,
  Card,
  CardHeader,
  CardBody,
  Button,
  ButtonGroup,
  Text,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GiChaingun } from "react-icons/gi";
import QuillReact from "./QuillReact";
import "../App.css";
import { IoIosArrowBack } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import flower from "../assets/images/flowes.png";
import axios from "axios";

function ChapListComponent() {
  const { booksId, booksHeading } = useParams();
  const [activeSubchapter, setActiveSubchapter] = useState(1);
  const handleSubchapterClick = (subchapter) => {
    setActiveSubchapter(subchapter);
  };

  return (
    <>
      <Flex left={{ base: "8vw", sm: "10vw", md: "6vw" }} mx={{ base: "10%", lg: "8%" }} fontFamily="poppins" pos="fixed" h={{ base: "100%", lg: "auto" }} w="80%" zIndex={0} my="5%">
        <Box w="40%" display={{ base: "none", lg: "flex" }} h="full">
          <Card boxShadow="2xl" textAlign="center" w="full">
            <CardHeader>
              <Text fontWeight="800" fontSize="md">
                Chapters
              </Text>
            </CardHeader>
            <CardBody>
              <Accordion defaultIndex={""} allowToggle>
                {books.map((book) => (
                  <AccordionItem key={book.chapter}>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left" w="full">
                        Chapter {book.chapter} : {book.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Flex direction="column" gap={2} textAlign="left">
                        <Box w="px">
                          {book.subchapters.map((subchapter, index) => (
                            <Button key={index} variant="ghost" onClick={() => handleSubchapterClick(subchapter)} size="sm" fontWeight="500">
                              {subchapter}
                            </Button>
                          ))}
                        </Box>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>

              <Box pt={20}>
                <Link to="/project/:booksId/:booksHeading/new">
                  <Button>Back</Button>
                </Link>
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box mx="2%" w="100%" fontFamily="poppins" align="center" bg="white" px="2%" borderRadius={10} boxShadow="2xl">
          {books.map((book) => (
            <React.Fragment key={book.chapter}>
              {book.subchapters.map(
                (subchapter, index) =>
                  activeSubchapter === subchapter && (
                    <Flex key={index} direction="column" my={10} w="full" justify="center">
                      <Heading fontSize="3xl" textAlign="center">
                        {book.title}
                      </Heading>
                      <Heading align="center" fontSize="xl" fontWeight="500">
                        {activeSubchapter}
                      </Heading>
                      <ButtonGroup size="md" isAttached variant="solid" p={2}>
                        <Button colorScheme="purple">
                          <Text fontSize={{ base: "10px", md: "14px", lg: "16px" }}>Generate</Text>
                        </Button>
                        <IconButton aria-label="Add to friends" icon={<GiChaingun />} size="md" />
                        <Spacer />
                        <Link to="/print">
                          <Button colorScheme="red">Publish</Button>
                        </Link>
                      </ButtonGroup>
                      <Box></Box>
                      <Box mt={4} bgImage={flower} bg="black" objectFit={"cover"}>
                        <QuillReact />
                      </Box>
                    </Flex>
                  )
              )}
            </React.Fragment>
          ))}
        </Box>
      </Flex>
      <Box
        pos="fixed"
        top={0}
        right={0}
        bottom={0}
        justifyContent="center"
        alignItems="center"
        pr={4} // Padding right to add some space from the edge
        display={{ base: "flex", lg: "none" }}
      >
        <IconButton ref={btnRef} onClick={onOpen} color="white" size="lg" icon={<IoIosArrowBack />} colorScheme="red" />

        <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Chapters</DrawerHeader>

            <DrawerBody>
              <Accordion defaultIndex={""} allowToggle>
                {books.map((book) => (
                  <AccordionItem key={book.chapter}>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left" w="full">
                        Chapter {book.chapter} : {book.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Flex direction="column" gap={2} textAlign="left">
                        <Box w="px">
                          {book.subchapters.map((subchapter, index) => (
                            <Button key={index} variant="ghost" onClick={() => handleSubchapterClick(subchapter)} size="sm" fontWeight="500">
                              {subchapter}
                            </Button>
                          ))}
                        </Box>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </DrawerBody>
            <DrawerFooter>
              <Link to="/project/:booksId/:booksHeading/new">
                <Button>Back</Button>
              </Link>
            </DrawerFooter>
          </DrawerContent>
          <Box pt={20}></Box>
        </Drawer>
      </Box>
    </>
  );
}

export default ChapListComponent;
