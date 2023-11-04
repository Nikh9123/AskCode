"use client";

import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	// AvatarBadge,
	// IconButton,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/userPreviewImg";
import useShowToast from "../hooks/useShowToast";
// import { SmallCloseIcon } from '@chakra-ui/icons'

const UpdateProfilePage = () => {

  //TODO: fetch the user data from the local storage of the browser
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		bio: user.bio,
		email: user.email,
		password: "",
	});

	const fileRef = useRef(null); // hook for file upload

  const showToast = useShowToast(); // custom hook coming from hooks folder

	const {handleImageChange, imgUrl} = usePreviewImg(); // custom hook coming from hooks folder

  //handle the submit event when user try to update the profile avatar
  const handleSubmit = async(e) =>{

		e.preventDefault(); 

    try {
      //TODO: fetch the API && send the data to the server to update the user profile
      
			const res =  await fetch(`api/user/updateMyProfile/${user._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...inputs, profilePic : imgUrl}),
      });

      const data = await res.json();

      if(data.error)
      {
        showToast("Avatar change failed", data.error,'error');
        return ;
      }
      setUser(data.data.newUser);
			localStorage.setItem("askcode-user", JSON.stringify(data.data.newUser));
      showToast("Avatar change success", "your profile updated succefully 😊",'success');
    } catch (error) {
      console.log(error)
      showToast("error", error.message,'error')
    }

  }

	return (
    <form onSubmit={handleSubmit}>
		<Flex align={"center"} justify={"center"} my={12}>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"md"}
				bg={useColorModeValue("white", "gray.dark")}
				rounded={"xl"}
				boxShadow={"lg"}
				p={6}>
				<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
					User Profile Edit
				</Heading>
				<FormControl id="userName">
					<Stack direction={["column", "row"]} spacing={6}>
						<Center>
							<Avatar size="xl" src={imgUrl || user.profilePic} />
						</Center>
						<Center w="full">
							<Button w="full" onClick={() => fileRef.current.click()}>
								Change Avatar
							</Button>
							<Input
								type="file"
								hidden={true}
								ref={fileRef}
								onChange={handleImageChange}
							/>
						</Center>
					</Stack>
				</FormControl>
				<FormControl >
					<FormLabel>Full Name</FormLabel>
					<Input
						placeholder="your name"
						_placeholder={{ color: "gray.500" }}
						type="text"
						value={inputs.name}
						onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
					/>
				</FormControl>

				<FormControl >
					<FormLabel>User name</FormLabel>
					<Input
						placeholder="UserName"
						_placeholder={{ color: "gray.500" }}
						type="text"
						value={inputs.username}
						onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					/>
					<FormControl >
						<FormLabel>Your bio</FormLabel>
						<Input
							placeholder="your bio"
							_placeholder={{ color: "gray.500" }}
							type="text"
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
						/>
					</FormControl>
				</FormControl>
				<FormControl >
					<FormLabel>Email address</FormLabel>
					<Input
						placeholder="your-email@example.com"
						_placeholder={{ color: "gray.500" }}
						type="email"
						value={inputs.email}
						onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
					/>
				</FormControl>
				<FormControl >
					<FormLabel>Password</FormLabel>
					<Input
						placeholder="password"
						_placeholder={{ color: "gray.500" }}
						type="password"
					/>
				</FormControl>
				<Stack spacing={6} direction={["column", "row"]}>
					<Button
						bg={"red.400"}
						color={"white"}
						w="full"
						_hover={{
							bg: "red.500",
						}}
						type="button"  
            >
						Cancel
					</Button>
					<Button
						bg={"green.400"}
						color={"white"}
						w="full"
						_hover={{
							bg: "blue.500",
						}}
            type="submit"
            >
						Submit
					</Button>
				</Stack>
			</Stack>
		</Flex>
    </form>
	);
};

export default UpdateProfilePage;
