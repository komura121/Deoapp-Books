import { Flex, Heading } from "@chakra-ui/react";
import Navbar from "../LAYOUTS/Navbar";
import Header from "../LAYOUTS/Header";
import "@fontsource/poppins";

import Footer from "../LAYOUTS/Footer";
import Background from "../LAYOUTS/Background";

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
