import { Flex, Heading } from "@chakra-ui/react";
import Navbar from "../LAYOUT/Navbar";
import Header from "../LAYOUT/Header";
import "@fontsource/poppins";

import Footer from "../LAYOUT/Footer";
import Background from "../LAYOUT/Background";

function DashboardPages() {
  return (
    <>
      <Navbar />
      <Header />
      <Footer />
      <Background />
    </>
  );
}

export default DashboardPages;
