import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Spacer, Heading, FormControl, FormHelperText, FormLabel, Input, Flex, Button, Image, Card, InputGroup, InputRightElement, InputLeftElement, IconButton, Link, InputLeftAddon, ButtonGroup } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import logo from "../assets/images/LogoBooks.png";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { IoMail } from "react-icons/io5";
import { IoIosKey } from "react-icons/io";
import { useStore } from "zustand";
import usePageStore from "../../config/usePageStore";

function Login() {
  const navigate = useNavigate();
  const { email, password, showPassword, setEmail, setPassword, setShowPassword } = usePageStore();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <>
      <Flex w="full" h="100vh" justify="center" objectFit="cover" bgPos="center" bgRepeat="no-repeat" bgImage="https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg">
        <Box
          minW="sm"
          px={8}
          borderRadius="lg"
          my="10%"
          py={2}
          boxShadow="lg"
          bg="rgba(26, 32, 44, 0.35)" // semi-transparent gray.900
          backdropFilter="blur(10px)" // adds a blur effect
          color="white"
          maxH="80%"
          alignContent="center"
          textAlign="center"
          pos="fixed"
        >
          <Box display="flex" justifyContent="center" w="full" alignItems="center">
            <Image src={logo} maxH="120px" objectFit="cover" />
          </Box>
          <FormControl mb={4}>
            <InputGroup borderColor="gray.700">
              <InputLeftAddon color="black" bg="gray.500">
                <IoMail />
              </InputLeftAddon>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
            </InputGroup>
          </FormControl>
          <Box>
            <ButtonGroup gap={3} my={2}>
              <Button colorScheme="teal" mb={4} size="sm" w="70%">
                Continue
              </Button>
            </ButtonGroup>
          </Box>
          <Box textAlign="center" mb={6} fontSize="12px">
            <Link color="teal.200" href="/signup">
              Don’t have any account? <b>Join now!</b>
            </Link>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default Login;
