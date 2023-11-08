import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome, AiFillWechat } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import useLogOut from "../hooks/useLogOut";
import authScreenAtom from "../atoms/authAtom";

const Header = () => {
  const user = useRecoilValue(userAtom); // give us the currently logged in user data from the global state coming from browser local storage
  const logOut = useLogOut();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link
          as={RouterLink}
					to={"/auth"}
          onClick={() => {
            setAuthScreen("login");
          }}
        >
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Link as={RouterLink} to={`${user.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}
      {user && (
        <Flex alignItems={"center"} gap={12}>
          <Link as={RouterLink} to="/askAi">
            <AiFillWechat size={24} />
          </Link>
          <Button size={"sm"}>
            {" "}
            {/* Logout */}
            {/* <HiOutLineLogout /> */}
            <IoLogOutOutline size={20} onClick={logOut} />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link
          as={RouterLink}
          onClick={() => {
            setAuthScreen("signup");
          }}
					to={"/auth"}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
