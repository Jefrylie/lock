import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus, FaRegEdit, FaRegTrashAlt, FaUserAlt } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api } from "../api/api";
import NavSidebar from "../components/NavSidebar";

export default function LockPage() {
  let searchTimeout;

  const nav = useNavigate();
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const IMGURL = process.env.REACT_APP_API_IMAGE_URL;
  const [Locks, setLocks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function fetchLocks() {
    setTableLoading(true);
    await api()
      .get(`v1/lock?page=${currentPage}&rows=${rows}`)
      .then((response) => {
        console.log(response.data);
        setLocks(response.data.unlockHistory.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTableLoading(false);
      });
  }

  useEffect(() => {
    fetchLocks();
  }, [searchInput, roleFilter, currentPage, rows]);
  return (
    <>
      <NavSidebar>
        <Flex
          w={"100%"}
          flexDir={"column"}
          px={"20px"}
          py={"15px"}
          gap={"20px"}
        >
          <Flex flexDir={"column"}>
            <Box
              background={"white"}
              boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.1)"}
            >
              <Flex
                fontSize={"20px"}
                color={"blue"}
                fontWeight={700}
                py={"15px"}
                px={"20px"}
              >
                Lock Lists
              </Flex>
              <Divider m={0} />
              <Flex py={3} px={3} w={"100%"} flexDir={"column"} gap={"12px"}>
                <Flex px={3}>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={onOpen}
                    size="md"
                    px={5}
                  >
                    Add Lock
                  </Button>
                </Flex>
                <TableContainer w={"100%"}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>No</Th>
                        <Th>Name</Th>
                        <Th>Model</Th>
                        <Th>Status</Th>
                        <Th>Serial Number</Th>
                        <Th textAlign="center">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Locks.map((val, index) => (
                        <Tr>
                          <Td>{index + 1}.</Td>
                          <Td>{val.lock.name}</Td>
                          <Td>{val.lock.model}</Td>
                          <Td>{val.lock.status}</Td>
                          <Td>{val.lock.serial_no}</Td>
                          <Td justifyContent={"center"}>
                            <Flex justifyContent={"center"}>
                              <Flex
                                gap={"15px"}
                                fontSize={"20px"}
                                justify={"space-between"}
                              >
                                <Tooltip
                                  hasArrow
                                  placement={"top"}
                                  label="History"
                                  aria-label="A tooltip"
                                  color={"white"}
                                >
                                  <Flex
                                    onClick={() =>
                                      nav(`/lock/history/${val.lock.id}`)
                                    }
                                    cursor={"pointer"}
                                  >
                                    <LuHistory />
                                  </Flex>
                                </Tooltip>
                                <Tooltip
                                  hasArrow
                                  placement={"top"}
                                  background={"#007BFF"}
                                  label={"Edit"}
                                  aria-label="A tooltip"
                                  color={"white"}
                                >
                                  <Flex cursor={"pointer"} color={"#007BFF"}>
                                    <FaRegEdit />
                                  </Flex>
                                </Tooltip>
                                <Tooltip
                                  hasArrow
                                  placement={"top"}
                                  label="Delete"
                                  aria-label="A tooltip"
                                  background={"crimson"}
                                  color={"white"}
                                >
                                  <Flex cursor={"pointer"} color={"crimson"}>
                                    <FaRegTrashAlt />
                                  </Flex>
                                </Tooltip>
                              </Flex>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    {/* <TableCaption>
                      Imperial to metric conversion factors
                    </TableCaption> */}
                  </Table>
                </TableContainer>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </NavSidebar>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input id="username" placeholder="Enter your username" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" variant="solid" onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
