import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Link,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import { IoMdLock } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";

const LinkItems = [
  { name: "Home", icon: FiHome, link: "/" },
  { name: "Locks", icon: IoMdLock, link: "/lock" },
  { name: "Users", icon: FaUserCog, link: "/user" },
  { name: "Settings", icon: FiSettings, link: "/setting" },
];

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();
  const nav = useNavigate();
  const pathSegments = location.pathname.split("/");
  const firstRouteSegment = pathSegments[1];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => {
            nav(link.link);
          }}
          isActive={"/" + firstRouteSegment === link.link}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, isActive, ...rest }) => {
  return (
    <Box
      as="a"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        bg={isActive ? "cyan.400" : "transparent"}
        color={isActive ? "white" : "black"}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, logout, data, ...rest }) => {
  const nav = useNavigate();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Flex fontSize="md" fontWeight="700">
                    {data?.first_name + " " + data?.last_name}
                  </Flex>
                  <Flex fontSize="xs" color="gray.600">
                    Admin
                  </Flex>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem
                onClick={() => {
                  nav("/lock");
                }}
              >
                Locks
              </MenuItem>
              <MenuItem
                onClick={() => {
                  nav("/");
                }}
              >
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  logout();
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const NavSidebar = ({ children }) => {
  const userSelector = useSelector((state) => state.login.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [data, setData] = useState();
  async function logout() {
    const response = await api().get(`user/logout`);
    localStorage.removeItem("auth");
    nav("/login");
    dispatch({
      type: "logout",
    });
  }

  async function fetchUser() {
    await api()
      .get(`user/show/${userSelector.id}`)
      .then((response) => {
        console.log(response.data);
        setData(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} logout={logout} data={data} />
      <Box ml={{ base: 0, md: 60 }} h={"1000px"}>
        {children}
      </Box>
    </Box>
  );
};

export default NavSidebar;
