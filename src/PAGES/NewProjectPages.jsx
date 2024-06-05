import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Image, Button, IconButton, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, FormControl, FormHelperText, Textarea, ButtonGroup, Input, useDisclosure } from "@chakra-ui/react";
import { FcEditImage, FcFullTrash } from "react-icons/fc";
import { GiChaingun } from "react-icons/gi";
import { Link } from "react-router-dom";
import Navbar from "../LAYOUTS/Navbar";
import Footer from "../LAYOUTS/Footer";
import Background from "../LAYOUTS/Background";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const storage = getStorage();
const firestore = getFirestore();

function NewProjectPages({ bookId }) {
  const [newChapter, setNewChapter] = useState(null);
  const [newTitle, setNewTitle] = useState(null);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png");
  const [newCoverImage, setNewCoverImage] = useState(null);
  const { isOpen: isImageBoxVisible, onToggle: toggleImageBox } = useDisclosure();
  const { isOpen: isDeleteBoxVisible, onToggle: toggleDeleteBox } = useDisclosure();

  useEffect(() => {
    if (newCoverImage) {
      saveCoverImageToFirestore(newCoverImage, bookId);
    }
  }, [newCoverImage, bookId]);

  const handleGenerate = () => {
    generateChapter(description);
    if (newCoverImage) {
      setCoverImage(newCoverImage);
    }
  };

  const saveCoverImageToFirestore = async (coverImageUrl, bookId, uid) => {
    const bookRef = doc(firestore, "books", bookId);
    try {
      // Retrieve the document to check the uid
      const docSnapshot = await getDoc(bookRef);

      if (docSnapshot.exists()) {
        const bookData = docSnapshot.data();

        // Check if the uid matches
        if (bookData.uid === uid) {
          // Ensure the uid field is correctly compared
          console.log(`Saving cover image to Firestore: ${coverImageUrl}`);
          await updateDoc(bookRef, {
            src: coverImageUrl,
          });
          console.log("Cover image saved to Firestore successfully");
        } else {
          console.error("UID does not match. Cannot update the cover image.");
        }
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error adding cover image to Firestore: ", error);
    }
  };

  const handleImageClick = () => {
    toggleImageBox();
  };

  const handleDeleteClick = () => {
    toggleDeleteBox();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const fileRef = ref(storage, file.name);
    try {
      console.log("Uploading image to Firebase Storage...");
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      console.log(`Image uploaded successfully. URL: ${url}`);
      setNewCoverImage(url);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleSaveImage = () => {
    if (newCoverImage) {
      setCoverImage(newCoverImage);
      saveCoverImageToFirestore(newCoverImage, bookId);
    }
    toggleImageBox();
  };

  return (
    <>
      <Navbar />
      <Flex direction="column" pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
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
            <Box minW="200px" textAlign="center" p={{ base: "3%", lg: "5%" }} bg="white" borderRadius="lg">
              <Text p="2%">Cover Book</Text>
              <Image src={coverImage} minH={{ base: "180px", sm: "230px", md: "250px", lg: "300px" }} maxW={{ base: "130px", sm: "180px", md: "200px", lg: "200px" }} mx="auto" />
              <Flex justify="center" my={4} direction={{ base: "column", xl: "row" }}>
                <ButtonGroup justifyContent="center" p={5}>
                  <Button onClick={handleImageClick} leftIcon={<FcEditImage size="25px" />} colorScheme="blue" variant="solid" size="md">
                    <Text fontWeight="100" display={{ base: "none", sm: "flex" }}>
                      Image
                    </Text>
                  </Button>
                  <Button onClick={handleDeleteClick} rightIcon={<FcFullTrash size="25px" />} colorScheme="red" variant="solid" size="md">
                    <Text fontWeight="100" display={{ base: "none", sm: "flex" }}>
                      Delete
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
              {isDeleteBoxVisible && (
                <Box>
                  <Text mb={2}>Are You Sure Delete This Cover?</Text>
                  <ButtonGroup gap={2}>
                    <Button variant="outline" onClick={toggleDeleteBox}>
                      Cancel
                    </Button>
                    <Button colorScheme="red">Delete</Button>
                  </ButtonGroup>
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
      <Footer />
      <Background />
    </>
  );
}

export default NewProjectPages;
