import { Flex, Image, Td, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import emptyIllustration from "../assets/images/EmptyStateImage.png";

export default function ListEmptyState({
  colSpan,
  header1,
  header2,
  link,
  linkText,
}) {
  const nav = useNavigate();
  return (
    <Tr>
      <Td colSpan={colSpan}>
        <Flex
          w={"100%"}
          justifyContent={"center"}
          py={"40px"}
          flexDir={"column"}
          alignItems={"center"}
        >
          {/* <Image w={"200px"} src={emptyIllustration}></Image> */}
          <Flex flexDir={"column"} gap={"5px"} alignItems={"center"}>
            <Flex color={"#dc143c"} fontWeight={700}>
              {header1}
            </Flex>
            <Flex color={"#848484"}>
              {link && linkText ? (
                <Flex
                  cursor={"pointer"}
                  onClick={() => {
                    nav(link);
                  }}
                  color={"#dc143c"}
                  textDecor={"underline"}
                >
                  {linkText}
                </Flex>
              ) : (
                ""
              )}
              <Flex>&nbsp;{header2}</Flex>
            </Flex>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
}
