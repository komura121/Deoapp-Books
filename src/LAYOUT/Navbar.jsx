import React, { useEffect } from "react";
import { Box, Flex, Icon, Text, Link, Image, Spacer, Button } from "@chakra-ui/react";
import { FcAddDatabase, FcPrint, FcPackage } from "react-icons/fc";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import Logo from "../assets/images/Deoapp.png";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("uid", user.uid);
      } else {
        console.log("user is logged out");
        navigate("/login"); // Redirect to login if user is logged out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navItems = [
    { icon: FcPackage, label: "Project", href: "/" },
    { icon: FcPrint, label: "Print", href: "/Print" },
    { icon: FcAddDatabase, label: "Stock", href: "/Stock" },
  ];

  return (
    <Flex bg="white" color="black" zIndex={2} w={{ base: "18vw", md: "12vw", lg: "6vw" }} pos="fixed" minH="full" align="flex-start" top="0">
      <Box w="full">
        <Box flex="1" align="center">
          <Image src={Logo} alt="Logo" w="70%" />
        </Box>

        <Flex direction="column" mt={10} px={1}>
          <Box>
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} style={{ textDecoration: "none" }} minW="100px">
                <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                  <Icon as={item.icon} fontSize={{ base: "25px", lg: "30px" }} align="center" color="red" />
                  <Text align="center" fontSize={{ base: "8px", md: "10px", lg: "14px" }}>
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            ))}
            <Link style={{ textDecoration: "none" }} minW="100px">
              <Flex direction="column" gap={2} my={2} align="center" px="4" py="2" onClick={handleLogout} borderRadius="xl" role="group" cursor="pointer" _hover={{ bg: "red.500", color: "white" }}>
                <Icon as={MdOutlinePowerSettingsNew} fontSize={{ base: "25px", lg: "30px" }} align="center" color="red" />
                <Text align="center" fontSize={{ base: "8px", md: "10px", lg: "14px" }}>
                  Log Out
                </Text>
              </Flex>
            </Link>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Navbar;
