import {
	Avatar,
	Box,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	Link,
	Portal,
	Text,
	VStack,
	MenuItem,
	useToast,
	Button,
} from "@chakra-ui/react";
import { BsGithub, BsTwitter } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {Link as RouterLink} from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

export const UserHeader = ({user}) => {
	const [updating , setUpdating] = useState(false);
	const toast = useToast();
  const showToast = useShowToast(); // custom hook coming from hooks folder
	const currentUser = useRecoilValue(userAtom); // get the current logged in user data from the global state coming from browser local storage

	const [following , setFollowing] = useState(user.followers.includes(currentUser._id)); // when user follow another user, the following state will add the user id to the following array
  console.log(following)

	const copyURL = () => {
		//copy url link
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Copied.",
				description: "user profile copied",
				status: "success",
				duration: 600,
				isClosable: true,
			});
		});
	};
  
	const handleFollowUnfollow = async() => {
		if(!currentUser._id)
		{
			showToast("error", "you must login first to follow or unfollow", "error");
			return ;
		}
		if(updating) return ; // if the user is already updating the profile, don't do anything (prevent spamming the button)
		setUpdating(true);
		try {
			const res = await fetch(`/api/user/follow/${user._id}`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			});
			const data = await res.json();
			if (data.error) {
				console.log("error from handleFollowUnfollow : ", data.error);
				showToast("error", data.error, "error");
				return;
			}

			if(following)
			{
				showToast("success", `you unfollowed ${user.name}`, "success");
				user.followers = user.followers.filter((follower) => follower !== currentUser._id);
			}
			else{
				showToast("success", `you followed ${user.name}`, "success");
				user.followers.push(currentUser._id);
			}


			console.log(data);
      setFollowing(!following);
		} catch (error) {
			console.log("error from handleFollowUnfollow : ", error);
			showToast("error", error.message, "error");
		}
		finally{
			setUpdating(false);//this will be executed in both cases (success or fail)
		}
	}

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontWeight={"bold"} fontSize={"2xl"}>
						{user.name}
					</Text>
					<Flex alignItems={"center"} gap={2}>
						<Text fontSize={{
                base:"xs",
                md:"sm",
                lg:"md",
              }}>{user.username}</Text>
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
					{user.profilePic ? <Avatar size={
						{
							base:"md",
							md:"lg"
						}
					} name={user.name} src={user.profilePic} />: <Avatar size={
						{
							base:"md",
							md:"lg"
						}
					} name={user.name} src='https://bit.ly/broken-link'/>}
				</Box>
			</Flex>
			<Text>
				{user.bio}
			</Text>
			{currentUser._id === user._id && (
				<Link as={RouterLink} to={"/updateMe"}><Button size={"sm"}>Update Profile</Button></Link>
			)}
			{currentUser._id !== user._id && (
				<Link as={RouterLink} ><Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>{following ? 'Unfollow' : 'Follow'}</Button></Link>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
					<Text color={"gray.light"}>{user.following.length} following</Text>
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
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										copy profile
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Flex w={"full"}>
				<Flex
					flex={1}
					borderBottom={"1.5px solid white"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}>
					<Text fontWeight={"bold"}>asks</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					color={"gray.white"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}>
					<Text fontWeight={"bold"}>replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};
