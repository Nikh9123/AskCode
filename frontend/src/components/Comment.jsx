import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";



const Comment = ({reply}) => {
	console.log("reply: ", reply);
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar
					name={reply.username}
					src={reply.userProfilePic}
					size={"sm"}
				/>
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex
						w={"full"}
						justifyContent={"space-between"}
						alignItems={"center"}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{reply.username}
						</Text>
						
					</Flex>
					<Text>{reply.text}</Text>

				</Flex>
			</Flex>
			<Divider my={4} />
		</>
	);
};

export default Comment;

//1:31:00
