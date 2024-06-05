import React from "react";
import { Box } from "@chakra-ui/react";
import blob from "../assets/images/blob.png";

function Background() {
  return (
    <>
      <Box h="100vh" w="100vw" bgImage={blob} position="fixed" top="0px" zIndex="-100" />
    </>
  );
}

export default Background;
