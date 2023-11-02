"use client";

import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

const SignupCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom)


	const [input, setInput] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
    passwordConfirm: "",
	});
  const showToast = useShowToast();// this is used in the handleSignup function to display a toast message

	const handleSignup = async () => {
		try {
			const res = await fetch("/api/user/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),//converts the input object into a JSON
			});
      const data = await res.json();
      if(data.error)
      {
				showToast("error", data.error, "error");
        return ;
      }
			showToast("success", data.status, "success");
			setUser(data.data.user);//set the user in the userAtom
      

			//set the user in the local storage
      localStorage.setItem("askcode-user", JSON.stringify(data.data.user));
		} catch (error) {
			showToast("error", "unable to signup", "error");
			console.log("error from SignUp page handleSignup : ", error);
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign Up
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Full Name</FormLabel>
									<Input
										type="text"
										onChange={(e) =>
											setInput({ ...input, name: e.target.value })
										} //it is used to store the input value in the state
										value={input.name} //it is used to clear the input field after submit
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type="text"
										onChange={(e) =>
											setInput({ ...input, username: e.target.value })
										}
										value={input.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								onChange={(e) => setInput({ ...input, email: e.target.value })}
								value={input.email}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) =>
										setInput({ ...input, password: e.target.value })
									}
									value={input.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
            <FormControl isRequired>
							<FormLabel>Password Confirm</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}//this is the same as the confirm password field above
									onChange={(e) =>
										setInput({ ...input, passwordConfirm : e.target.value })
									}
									value={input.passwordConfirm}
								/>
								<InputRightElement h={"full"}>
									{/* <Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button> */}
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								size="lg"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								onClick={handleSignup}>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user ?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default SignupCard;
