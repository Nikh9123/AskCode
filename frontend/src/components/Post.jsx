import {
	Avatar,
	Box,
	Flex,
	Image,
	Text,
	// Menu,
	// MenuButton,
	// MenuList,
	// MenuItem,
	// // MenuDivider,
	// // Button,
	// // Icon,
	// IconButton,
} from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";

import { useEffect, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post, postedBy }) => {
	const [liked, setLiked] = useState(false);
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
  const maxVisibleLength = 55;

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const res = await fetch(`api/user/profile/${postedBy}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				if (data.error) {
					showToast("error", data.error, "error");
					return;
				}
				// console.log(data.data.user)
				setUser(data.data.user);
			} catch (error) {
				showToast("error", error.message, "error");
				setUser(null);
			}
		};
		getUser();
		setLoading(false);
	}, [postedBy, showToast]);

	// highlight urls in the text
	const highlightUrls = (text, maxVisibleLength) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g; // find all urls in the text and put them in an array
  return text.split(urlRegex).map((part, index) => { //For each segment (part) in the array, it checks if it matches the urlRegex. If it's a URL, it wraps the URL in an anchor (<a>) element, making it clickable.
		//index is the index of the part in the array
    if (part.match(urlRegex)) {// if the part is a url then truncate it and highlight it
      
			const truncatedPart =
        part.length > maxVisibleLength
          ? part.slice(0, maxVisibleLength) + "..."
          : part;

      return (
				// <-- Using the index as the key prop for the anchor element 
				// he key prop helps React identify which items have changed, are added, or are removed. React uses these keys to efficiently update the UI.
        <span key={index}> 
          <a
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(part, "_blank");
            }}
            style={{
              color: "blue",
              textDecoration: "underline",
              fontSize: {
                base: "xs",
                md: "sm",
                lg: "md",
              },
              cursor: "pointer",
            }}
          >
            {truncatedPart} 
          </a>
        </span>
      );
    }
    return part;// if the part is not a url then return it as it is
  });
};

	
	

	if (!user) return null;
	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5} cursor={"auto"}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size={"md"}
						name={user.name}
						src={user.profilePic}
						cursor={"pointer"}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥹</Text>}
						{post.replies[0] && (
							<Avatar
								size={"xs"}
								name={post.replies[0].username}
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							/>
						)}
						{post.replies[1] && (
							<Avatar
								size={"xs"}
								name={post.replies[1].username}
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right={"-5px"}
								padding={"2px"}
							/>
						)}
						{post.replies[2] && (
							<Avatar
								size={"xs"}
								name={post.replies[2].username}
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left={"4px"}
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text
								fontSize={{
									base: "xs",
									md: "sm",
									lg: "md",
								}}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
								fontWeight={"bold"}
								cursor={"pointer"}>
								{user.username}
							</Text>
							<Image src="/verified.png " w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"} cursor={"pointer"} fontSize={"x-small"} textAlign={"right"}>
							<Text fontStyle={"sm"} color={"gray.light"} width={32} >
								{formatDistanceToNow(new Date(post.createdAt))} ago	
							</Text>
							<ArrowForwardIcon boxSize={"4"}/>
						</Flex>
					</Flex>
					<Text
						fontSize={{
							base: "xs",
							md: "sm",
							lg: "md",
						}}
						fontWeight={"medium"}
						cursor={"pointer"}>
						{post.text}{" "}
					</Text>
					{post.img && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							border={"1px solid"}
							borderColor={"gray.light"}>
							<Image src={post.img} w={"full"} />
						</Box>
					)}
					{post.errorDisc && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							borderColor={"gray.light"}>
							<Text
								fontSize={{
									base: "xs",
									md: "sm",
									lg: "md",
								}}
								cursor={"auto"}>
								{highlightUrls(post.errorDisc, maxVisibleLength)}
							</Text>
						</Box>
					)}
					{/* {post.errorDisc && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							borderColor={"gray.light"}>
							<Text
								fontSize={{
									base: "xs",
									md: "sm",
									lg: "md",
								}}
								cursor={"auto"}>
								{highlightUrls(post.errorDisc) }
							</Text>
						</Box> */}
					{/* )} */}
					<Flex gap={3} my={1} cursor={"pointer"}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>
					<Flex gap={2} alignItems={"center"}>
						<Text
							color={"gray.light"}
							fontSize={{
								base: "xs",
								md: "sm",
								lg: "md",
							}}>
							{post.likes.length} likes
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
						<Text
							color={"gray.light"}
							fontSize={{
								base: "xs",
								md: "sm",
								lg: "md",
							}}
							cursor={"pointer"}>
							{post.replies.length} replies
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default Post;
