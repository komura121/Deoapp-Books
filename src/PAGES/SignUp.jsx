import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, useToast, Heading, FormControl, FormHelperText, Input, Flex, Button, Image, InputGroup, InputRightElement, InputLeftElement, IconButton, Link, Text } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../../config/firebase";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { IoMail } from "react-icons/io5";
import { IoIosKey } from "react-icons/io";
import logo from "../assets/images/LogoBooks.png";
import { doc, setDoc } from "firebase/firestore";
import { FaUser } from "react-icons/fa";

function SignUp() {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.name,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
      toast({
        title: "Signed up with Google successfully!",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Flex w="full" h="100vh" justify="center" align="center" bgImage="https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg" bgPos="center" bgRepeat="no-repeat">
      <Box w={{ base: "90%", md: "400px" }} p={8} borderRadius="lg" boxShadow="lg" bg="rgba(26, 32, 44, 0.85)" backdropFilter="blur(10px)" color="white" textAlign="center">
        <Box mb={6}>
          <Image src={logo} maxH="120px" objectFit="cover" mx="auto" />
        </Box>
        <form onSubmit={handleSignup}>
          <FormControl mb={4} isRequired>
            <InputGroup borderColor="gray.700">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <FaUser />
              </InputLeftElement>
              <Input type="text" value={name} color="white" onChange={(e) => setEmail(e.target.value)} placeholder="Fullname" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
            </InputGroup>
          </FormControl>
          <FormControl mb={4} isRequired>
            <InputGroup borderColor="gray.700">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <IoMail />
              </InputLeftElement>
              <Input type="email" value={email} color="white" onChange={(e) => setEmail(e.target.value)} placeholder="Email" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
            </InputGroup>
          </FormControl>
          <FormControl mb={4} isRequired>
            <InputGroup borderColor="gray.700" size="md">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <IoIosKey />
              </InputLeftElement>
              <Input type={showPassword ? "text" : "password"} color="white" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" bg="gray.700" borderColor="gray.600" _placeholder={{ color: "gray.400" }} />
              <InputRightElement width="3rem">
                <IconButton h="1.75rem" size="sm" onClick={handleShowPassword} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} />
              </InputRightElement>
            </InputGroup>
            <FormHelperText color="gray.500">Minimum 6 characters</FormHelperText>
          </FormControl>
          {error && (
            <Text color="red.500" mb={4}>
              {error}
            </Text>
          )}
          <Button colorScheme="teal" mb={4} type="submit" w="full">
            Sign Up
          </Button>
        </form>
        <Button colorScheme="red" mb={4} w="full" onClick={handleGoogleSignup}>
          Sign Up with Google
        </Button>
        <Box textAlign="center" mt={4} fontSize="12px">
          <Link color="teal.200" href="/login">
            Already have an account? <b>Login here!</b>
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}

export default SignUp;
