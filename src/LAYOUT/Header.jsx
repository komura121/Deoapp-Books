import logo from "../assets/images/BooksLogo.png";
import svg from "../assets/images/blob.svg";
import { VStack, Flex, Box, Card, CardHeader, CardBody, CardFooter, Text, Heading, Button, Image, Tooltip, SimpleGrid, Input, InputGroup, Tag } from "@chakra-ui/react";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import bg from "../assets/images/Bg.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, deleteDoc, doc, query, where, getDoc } from "../../config/firebase";
import { FcFullTrash } from "react-icons/fc";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Header() {
  const [newBooks, setNewBooks] = useState([]);
  const [newBookName, setNewBookName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");

  const handleInputChange = (e) => {
    setNewBookName(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  // Fetch user data and books
  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name); // Assuming "name" is the field in the user document
      }
    };

    const fetchBooks = async (uid) => {
      const booksCollection = collection(db, "books");
      const q = query(booksCollection, where("uid", "==", uid));
      const booksSnapshot = await getDocs(q);
      const booksList = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewBooks(booksList);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
        fetchBooks(currentUser.uid);
      } else {
        setUser(null);
        setNewBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add Data
  const handleAddBook = async () => {
    if (newBookName.trim() !== "" && coverImageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `coverImages/${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const newBook = {
        heading: newBookName,
        src: imageUrl,
        text: "Lorem",
        deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "",
        label: "",
        category: "",
        pemilik: userName,
        uid: user.uid,
      };

      try {
        const docRef = await addDoc(collection(db, "books"), newBook);
        newBook.id = docRef.id;
        setNewBooks([...newBooks, newBook]);
        setNewBookName("");
        setCoverImageFile(null);
        onClose();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const navigate = useNavigate();
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteDoc(doc(db, "books", bookId));
      setNewBooks(newBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleCardClicked = (booksId, booksHeading) => {
    navigate(`/project/${booksId}/${booksHeading}/new`);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box pl={{ base: "18vw", md: "12vw", lg: "6vw" }}>
        <VStack bg="white" px={{ base: "20%", md: "20%", lg: "10%" }} maxW="100%">
          <Heading size="3xl" fontFamily="poppins">
            <Image src={logo} alt="Logo" maxH="350px" />
          </Heading>
          <Text align="center" mx="20%" fontSize="md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ex, ipsum accusantium molestiae deleniti natus voluptatum iusto, voluptatem tenetur, vero nam! Ipsa optio delectus ut illo aspernatur natus iure. Debitis. Sunt ab
            dolorem saepe, repellendus, soluta sapiente recusandae at, porro eveniet similique vitae nobis iusto repellat.
          </Text>
          <Box align={{ base: "center", lg: "end" }} mx="5%" my="2%">
            <Button onClick={onOpen} colorScheme="red" height="50px">
              Create New Book
            </Button>
          </Box>
        </VStack>
        <Flex direction="column" justify="center">
          <Box maxH="100%" pt={10} pb={20} px={{ base: "20%", md: "20%", lg: "10%" }} borderRadius={20}>
            <Heading py={6} textAlign="center" size="lg">
              Your Project
            </Heading>
            <SimpleGrid templateColumns="repeat(auto-fit, minmax(250px, 0.2fr))" gap={4}>
              <Card align="center" shadow="2xl" maxW="250px" bgColor="white">
                <CardHeader></CardHeader>
                <CardBody>
                  <Box>
                    <Button onClick={onOpen} minW="180px" minH="250px">
                      +
                    </Button>
                  </Box>
                  <Text fontWeight="600" textAlign="center" fontSize="md" m={4}>
                    New Project
                  </Text>
                </CardBody>
                <CardFooter gap={2}>
                  <Tag colorScheme="blue" size="sm"></Tag>
                  <Tag colorScheme="red" size="sm"></Tag>
                </CardFooter>
              </Card>
              {newBooks.length > 0 ? (
                newBooks.map((item, index) => (
                  <Card key={index} align="center" shadow="2xl" maxW="250px" justify="center">
                    <CardBody>
                      <Box align="center">
                        <Flex justifyContent="flex-end" mb={2}>
                          <Button variant="ghost" colorScheme="red" onClick={() => handleDeleteBook(item.id)}>
                            <FcFullTrash />
                          </Button>
                        </Flex>
                        <Button as={Box} maxW="200px" maxH="350px" variant="unstyled" onClick={() => handleCardClicked(item.id, item.heading)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                          <Image w="180px" h="250px" src={item.src} alt={item.heading} objectFit="cover" />
                        </Button>
                      </Box>
                      <Text fontWeight="600" fontSize="md" textAlign="center" m={4}>
                        {item.heading}
                      </Text>
                    </CardBody>
                    <CardFooter gap={2}>
                      <Tag colorScheme="blue" size="sm">
                        {item.category}
                      </Tag>
                      <Tag colorScheme="green" size="sm">
                        {item.label}
                      </Tag>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div></div>
              )}
            </SimpleGrid>
          </Box>
        </Flex>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Project</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputGroup>
                <Input value={newBookName} onChange={handleInputChange} placeholder="Your Project Name"></Input>
              </InputGroup>
              <Input type="file" onChange={handleImageChange} mt={4} />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleAddBook}>
                Create Project
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default Header;
