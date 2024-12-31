import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
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
import moment from "moment";
import { FaPlus, FaRegEdit, FaRegTrashAlt, FaUserAlt } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api } from "../api/api";
import NavSidebar from "../components/NavSidebar";

export default function LockHistoryPage() {
  let searchTimeout;

  const { lockId } = useParams();
  const nav = useNavigate();
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const IMGURL = process.env.REACT_APP_API_IMAGE_URL;
  const [History, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function fetchLocks() {
    setTableLoading(true);
    await api()
      .get(`v1/history/${lockId}?page=${currentPage}&rows=${rows}`)
      .then((response) => {
        console.log(response.data);
        setHistory(response.data.unlockHistory.data);
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
                History Lock Lists
              </Flex>
              <Divider m={0} />
              <Flex py={3} px={3} w={"100%"} flexDir={"column"} gap={"12px"}>
                <TableContainer w={"100%"}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>No</Th>
                        <Th>Image</Th>
                        <Th>Status</Th>
                        <Th>date</Th>
                        <Th textAlign="center">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {History.map((val, index) => (
                        <Tr>
                          <Td>{index + 1}.</Td>
                          <Td>
                            {/* <Box boxSize="sm">
                              <Image
                                src={IMGURL + val.image_url}
                                alt="Dan Abramov"
                              />
                            </Box> */}
                            <Box boxSize="sm">
                              <Image
                                src="https://bit.ly/dan-abramov"
                                alt="Dan Abramov"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                val?.status === "pass" ? "green" : "red"
                              }
                              borderRadius="full"
                              px={4}
                              py={2}
                              textTransform="uppercase"
                            >
                              {val?.status}
                            </Badge>
                          </Td>
                          <Td>
                            {moment(val?.created_at).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </Td>
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
                    {/* <TableCaption></TableCaption> */}
                  </Table>
                </TableContainer>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </NavSidebar>
    </>
  );
}
