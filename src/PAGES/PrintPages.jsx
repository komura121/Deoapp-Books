import React, { useEffect } from "react";
import Navbar from "../LAYOUTS/Navbar";
import Header from "../LAYOUTS/Header";
import Background from "../LAYOUTS/Background";
import { Flex, Box, Card, CardHeader, CardBody, CardFooter, Image, Button, Text, Tag } from "@chakra-ui/react";
import usePageStore from "../../config/usePageStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { collection, doc, getDocs, getDoc, db, query, where } from "../../config/firebase";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function PrintPages() {
  const { newBooks, newBookName, coverImageUrl, coverImageFile, user, userName, setNewBooks, setNewBookName, setCoverImageUrl, setImageFile, setUser, setUserName } = usePageStore();
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
  return (
    <>
      <Navbar />
      <Flex direction="column" pl="6vw" align="center">
        <Box m="5%">
          {newBooks.length > 0 ? (
            <Carousel
              responsive={{
                superLargeDesktop: {
                  breakpoint: { max: 4000, min: 3000 },
                  items: 5,
                },
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 3,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 2,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                },
              }}
            >
              {newBooks.map((item, index) => (
                <Box key={index} align="center" shadow="2xl" maxW="250px" justify="center">
                  <CardBody>
                    <Box align="center">
                      <Button as={Box} maxW="200px" maxH="350px" variant="unstyled" onClick={() => handleCardClicked(item.id, item.heading)} cursor="pointer" _hover={{ boxShadow: "2xl", color: "black" }}>
                        <Image w="180px" h="250px" src={item.coverImg} alt={item.heading} objectFit="cover" />
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
                  <Text fontSize="8px" color="teal">
                    author : {item.pemilik}
                  </Text>
                </Box>
              ))}
            </Carousel>
          ) : (
            <div></div>
          )}
        </Box>
      </Flex>
      <Background />
    </>
  );
}

export default PrintPages;
