import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
	const user = useRecoilValue(userAtom); // give us the currently logged in user data from the global state coming from browser local storage

	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Flex justifyContent={"space-between"} mt={6} mb={12}>
			{user && (
				<Link as={RouterLink} to="/">
					<AiFillHome size={24} />
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
				<Link as={RouterLink} to={`/user.username`}>
					<RxAvatar size={24}/>
				</Link>
			)}
		</Flex>
	);
};

export default Header;
