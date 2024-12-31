import { Box, Center, Flex, Spinner } from "@chakra-ui/react";

export default function LoadingOverlay() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(255, 255, 255, 0.9)"
      zIndex="2000"
    >
      <Center
        flexDir={"column"}
        alignItems={"center"}
        gap={"20px"}
        height="100%"
        opacity={1}
      >
        <Spinner thickness="4px" size="xl" color="blue.400" />
        <Center flexDir={"column"} color={"blue.400"} fontWeight={700}>
          <Flex fontWeight={700} fontSize={"20px"}>
            Loading
          </Flex>
          <Flex color={"black"}>Processing your request...</Flex>
        </Center>
      </Center>
    </Box>
  );
}
