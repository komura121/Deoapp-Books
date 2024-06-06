import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormHelperText,
  Textarea,
  ButtonGroup,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FcEditImage } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { Link, useParams } from "react-router-dom"; // Import useParams
import Navbar from "../LAYOUTS/Navbar";
import Footer from "../LAYOUTS/Footer";
import Background from "../LAYOUTS/Background";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import generateChapters from "../../config/api";
import { db } from "../../config/firebase";

function NewProjectPages() {
  const [newChapter, setNewChapter] = useState(null);
  const [description, setDescription] = useState("");
  const { isOpen: isImageBoxVisible, onOpen: openImageBox, onClose: closeImageBox } = useDisclosure();
  const [coverImageUrl, setCoverImageUrl] = useState("https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png");
  const { booksId, booksHeading } = useParams();

  useEffect(() => {
    const fetchBookData = async () => {
      if (!booksId) {
        console.error("Book ID is undefined.");
        return;
      }

      try {
        const bookRef = doc(db, "books", booksId);
        const bookSnap = await getDoc(bookRef);

        if (bookSnap.exists()) {
          const bookData = bookSnap.data();
          if (bookData && bookData.coverImg) {
            setCoverImageUrl(bookData.coverImg);
          } else {
            console.error("Cover image data not found in the book data.");
          }
        } else {
          console.error("Book document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [booksId]);

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `covers/${file.name}`);

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      setCoverImageUrl(downloadURL);

      closeImageBox();
      const bookRef = doc(db, "books", booksId);
      await updateDoc(bookRef, {
        coverImg: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const parseChapters = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const chapters = {};
    let currentChapter = "";
    let subchapterCount = 0;

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("chapter")) {
        currentChapter = `chapter${Object.keys(chapters).length + 1}`;
        chapters[currentChapter] = { title: line.trim(), subchapters: {} };
        subchapterCount = 0;
      } else if (line.toLowerCase().startsWith("subchapter")) {
        subchapterCount++;
        chapters[currentChapter].subchapters[`subchapter${subchapterCount}`] = { title: line.trim(), content: "" };
      } else if (currentChapter) {
        const subchapterKey = `subchapter${subchapterCount}`;
        if (chapters[currentChapter].subchapters[subchapterKey]) {
          chapters[currentChapter].subchapters[subchapterKey].content += ` ${line.trim()}`;
        }
      }
    });

    return chapters;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      const result = await generateChapters(booksHeading, description);
      const parsedChapters = parseChapters(result);
      setNewChapter(parsedChapters);

      const bookRef = doc(db, "books", booksId);
      await updateDoc(bookRef, {
        chapters: parsedChapters,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "7vw" }} pos="fixed" py={3}>
        <Box m={2}>
          <Link to="/">
            <Button variant="solid" colorScheme="green">
              Back
            </Button>
          </Link>
        </Box>
      </Flex>
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
        <Flex direction={{ base: "column", lg: "row" }} pt="1.5" mx={{ base: "20%", md: "10%", lg: "10%" }} my={{ base: 4, md: 4 }} gap={4}>
          <Box>
            <Box minW="300px" textAlign="center" p={{ base: "3%", lg: "5%" }} bg="white" borderRadius="lg">
              <Text p="2%">Cover Book</Text>
              <Image src={coverImageUrl} alt="Cover Image" minH={{ base: "180px", sm: "230px", md: "250px", lg: "300px" }} maxW={{ base: "130px", sm: "180px", md: "200px", lg: "200px" }} mx="auto" />
              <Flex justify="center" my={4} direction={{ base: "column", xl: "row" }}>
                <ButtonGroup justifyContent="center" p={5}>
                  <Button onClick={openImageBox} leftIcon={<FcEditImage size="25px" />} colorScheme="blue" variant="solid" size="md">
                    <Text fontWeight="100" display={{ base: "none", sm: "flex" }}>
                      Change Image
                    </Text>
                  </Button>
                </ButtonGroup>
              </Flex>
            </Box>
          </Box>
          <Flex w="full">
            <Box flex="1" bg="white" borderRadius="lg" px="5%">
              <Heading as="h2" size="md" my={5} fontWeight="600">
                {booksHeading}
              </Heading>
              <Accordion defaultIndex={[1]} allowMultiple>
                {newChapter &&
                  Object.keys(newChapter).map((chapterKey) => (
                    <AccordionItem key={chapterKey}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {newChapter[chapterKey].title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        {Object.keys(newChapter[chapterKey].subchapters).map((subchapterKey) => (
                          <Box key={subchapterKey}>
                            <Text fontWeight="bold">{newChapter[chapterKey].subchapters[subchapterKey].title}</Text>
                            <Text>{newChapter[chapterKey].subchapters[subchapterKey].content}</Text>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
              </Accordion>
            </Box>
          </Flex>
        </Flex>

        <Flex direction="column" px={{ base: "20%", md: "10%", lg: "8%" }}>
          <Box px="2%" py="2%" mx="2%" mb="5%" bg="white" borderRadius="xl">
            <Box align="end">
              <ButtonGroup size="md" isAttached variant="outline">
                <Button w={{ base: "100%", md: "auto" }} color="white" bgColor="blueviolet" onClick={handleGenerate}>
                  Generate
                </Button>
                <IconButton bg="white" aria-label="Generate" icon={<GiChaingun />} size="md" />
              </ButtonGroup>
            </Box>
            <Box>
              <Text>Description :</Text>
              <FormControl>
                <Textarea placeholder="Your Description" h={{ base: "180px", md: "200px" }} onChange={(e) => setDescription(e.target.value)} />
                <FormHelperText>Describe Your Books</FormHelperText>
              </FormControl>
            </Box>
          </Box>
        </Flex>
      </Flex>
      {/* modal image Change */}
      <Modal isOpen={isImageBoxVisible} onClose={closeImageBox}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Cover Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Image upload form or input */}
            <Input h="200px" borderStyle="dashed" alignContent="center" type="file" onChange={handleChangeImage} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeImageBox}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
      <Background />
    </>
  );
}

export default NewProjectPages;
