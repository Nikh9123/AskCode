/* eslint-disable react/no-unescaped-entities */
"use client";

import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
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
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const LoginCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [loading, setLoading] = useState(false);

	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const [input, setInput] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/user/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			const data = await res.json();
			if (data.error) {
				showToast("fail", data.error, "error");
				return;
			}

			//1. show the toast
			showToast("success", data.status, "success");

			//2. set the user in the userAtom so that the setUser state is updated
			setUser(data.data.user);

			//3. set the user in the local storage
			localStorage.setItem("askcode-user", JSON.stringify(data.data.user));
		} catch (error) {
			showToast("error", "unable to signin", "error");
			console.log("error from SignUp page handleSignup : ", error);
		}finally{
			setLoading(false);
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Log In
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}
					w={{ base: "full", sm: "400px" }}>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								placeholder="username"
								onChange={(e) => {
									setInput({ ...input, username: e.target.value });
								}}
								value={input.username}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
								placeholder="password"
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
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="logging in"
								size="lg"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								isLoading={loading}
								onClick={handleLogin}>
								Login
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Don't have an account ?{" "}
								<Link
									color={"blue.400"}
									onClick={() => setAuthScreen("signup")}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default LoginCard;
