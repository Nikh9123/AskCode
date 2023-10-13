import {
	Avatar,
	Box,
	Flex,
	Link,
	Menu,
	MenuButton,
	MenuList,
	Portal,
	Text,
	VStack,
	MenuItem,
} from "@chakra-ui/react";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

export const UserHeader = () => {
  const copyURL = () => {
    const currentURL = window.location.href;
    console.log(currentURL)
  }
	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontWeight={"bold"} fontSize={"2xl"}>
						Nikhil Satyam
					</Text>
					<Flex alignItems={"center"} gap={2}>
						<Text fontSize={"sm"}>nikhil9123</Text>
						<Text
							fontSize={"xs"}
							bg={"gray.dark"}
							color={"gray.light"}
							p={0.5}
							borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					<Avatar size="xl" name="Nikhil Satyam" src="/zuck-avatar.png" />
				</Box>
			</Flex>
			<Text>
				a full stack web developer and my intrest is in backend as well as core
				of node js.
			</Text>
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>200 followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
					<Link color={"gray.light"}>
						<BsTwitter className="icon-container" />
					</Link>
				</Flex>
				<Flex>
					<Box className="icon-container">
						<BsGithub size={24} cursor={"pointer"} />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>copy profile</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
		</VStack>
	);
};
