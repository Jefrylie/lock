import {
  Button,
  Center,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaPlus, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Swal from "sweetalert2";
import { api } from "../api/api";
import ListEmptyState from "../components/ListEmptyState";
import NavSidebar from "../components/NavSidebar";

export default function UsersPage() {
  let searchTimeout;

  const nav = useNavigate();
  const [from, setFrom] = useState();
  const [rows, setRows] = useState(10);
  const [showing, setShowing] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const IMGURL = process.env.REACT_APP_API_IMAGE_URL;
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  async function fetchUsers() {
    setTableLoading(true);
    await api()
      .get(
        `user/pagination?search=${searchInput}&role=${roleFilter}&page=${currentPage}
        &rows=${rows}`
      )
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.data);
        setFrom(response.data.from);
        setTotalPages(response.data.last_page);
        setShowing({
          current: response.data.to,
          total: response.data.total,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTableLoading(false);
      });
  }
  async function deleteUser(id) {
    await api()
      .delete(`user/${id}`)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response?.data?.message,
          icon: "success",
          customClass: {
            popup: "swal2-custom-popup",
            title: "swal2-custom-title",
            content: "swal2-custom-content",
            actions: "swal2-custom-actions",
            confirmButton: "swal2-custom-confirm-button",
          },
        });
        fetchUsers();
        console.log(response.data);
      })
      .catch((error) => {
        Swal.fire({
          title: "Oops...",
          text: error.response.data.message || "An error occurred",
          icon: "error",
          customClass: {
            popup: "swal2-custom-popup",
            title: "swal2-custom-title",
            content: "swal2-custom-content",
            actions: "swal2-custom-actions",
            confirmButton: "swal2-custom-confirm-button",
          },
        });
        console.error(error);
      });
  }
  function roleHandler(event) {
    setTableLoading(true);
    const { id } = event.target;
    console.log(id);
    setRoleFilter(id);
  }

  const handleChange = (e) => {
    const { value, id } = e.target;
    if (id === "row") {
      setRows(value);
    } else {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        setSearchInput(value);
        setCurrentPage(1);
      }, 500);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchInput, roleFilter, currentPage, rows]);
  return (
    <NavSidebar>
      <Flex w={"100%"} flexDir={"column"} px={"30px"} py={"20px"} gap={"20px"}>
        <Flex flexDir={"column"}>
          <Flex fontSize={"28px"} color={"blue"} fontWeight={700}>
            User List
          </Flex>
        </Flex>
        <Flex justify={"space-between"}>
          <Flex gap={"20px"}>
            <Button
              onClick={() => {
                nav("/user/create");
              }}
              color={"blue"}
              borderRadius={"50px"}
              border={"1px solid blue"}
              bg={"white"}
              _hover={{ bg: "blue", color: "white" }}
            >
              <Flex alignItems={"center"} gap={"10px"}>
                <Flex>
                  <FaPlus />
                </Flex>
                <Flex>Create User</Flex>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </NavSidebar>
  );
}
