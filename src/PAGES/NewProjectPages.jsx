import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Image, Button, IconButton, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, FormControl, FormHelperText, Textarea, ButtonGroup, Input, useDisclosure } from "@chakra-ui/react";
import { FcEditImage } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { Link } from "react-router-dom";
import Navbar from "../LAYOUTS/Navbar";
import Footer from "../LAYOUTS/Footer";
import Background from "../LAYOUTS/Background";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

function NewProjectPages({ bookId }) {
  const [bookData, setBookData] = useState(null);
  const [newChapter, setNewChapter] = useState(null);
  const [newTitle, setNewTitle] = useState(null);
  const [description, setDescription] = useState("");
  const [newCoverImage, setNewCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png");
  const { isOpen: isImageBoxVisible, onToggle: toggleImageBox } = useDisclosure();
  const storage = getStorage();
  const firestore = getFirestore();

  const handleImageClick = () => {
    toggleImageBox();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleSaveImage = async () => {
    if (coverImageFile) {
      const storageRef = ref(storage, `covers/${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      const downloadURL = await getDownloadURL(storageRef);
      setCoverImageUrl(downloadURL);
      await updateDoc(doc(firestore, "books", bookId), { coverImageUrl: downloadURL });
    } else if (newCoverImage) {
      setCoverImageUrl(newCoverImage);
      await updateDoc(doc(firestore, "books", bookId), { coverImageUrl: newCoverImage });
    }
    toggleImageBox();
  };

  useEffect(() => {
    const fetchBookData = async () => {
      const bookRef = doc(firestore, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        const bookData = bookSnap.data();
        setBookData(bookData);
        if (bookData.coverImageUrl) {
          setCoverImageUrl(bookData.coverImageUrl);
        }
      }
    };
    fetchBookData();
  }, [firestore, bookId]);

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
                  <Button onClick={handleImageClick} leftIcon={<FcEditImage size="25px" />} colorScheme="blue" variant="solid" size="md">
                    <Text fontWeight="100" display={{ base: "none", sm: "flex" }}>
                      Change Image
                    </Text>
                  </Button>
                </ButtonGroup>
              </Flex>
              {isImageBoxVisible && (
                <Box>
                  <Text>Image source</Text>
                  <Input placeholder="your image source" size="sm" my={2} w="200px" onChange={(e) => setNewCoverImage(e.target.value)} />
                  <Input type="file" accept="image/*" variant="solid" onChange={handleImageChange} size="sm" my={2} w="200px" />
                  <Box>
                    <Button colorScheme="blue" onClick={handleSaveImage}>
                      Save
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Flex w="full">
            <Box flex="1" bg="white" borderRadius="lg" px="5%">
              <Heading as="h2" size="md" my={5} fontWeight="600">
                Chapters
              </Heading>
              {newChapter && newTitle ? (
                <Accordion defaultIndex={[1]} allowMultiple>
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="center">
                        {newChapter} : {newTitle}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={4}>{/* Content */}</AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p>Generate Chapters First</p>
                </div>
              )}
            </Box>
          </Flex>
        </Flex>

        <Flex direction="column" px={{ base: "20%", md: "10%", lg: "8%" }}>
          <Box px="2%" py="2%" mx="2%" mb="5%" bg="white" borderRadius="xl">
            <Box align="end">
              <ButtonGroup size="md" isAttached variant="outline">
                <Button w={{ base: "100%", md: "auto" }} color="white" bgColor="blueviolet">
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
      <Footer />
      <Background />
    </>
  );
}

export default NewProjectPages;
