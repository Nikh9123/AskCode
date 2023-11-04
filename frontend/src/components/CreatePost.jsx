import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import usePreviewImg from "../hooks/userPreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const maxCharTitle = 500;
const maxCharDescription = 1500;

const CreatePost = () => {
	const OverlayOne = () => (
		<ModalOverlay
			bg="blackAlpha.300"
			backdropFilter="blur(20px) hue-rotate(90deg)"
		/>
	);

	const OverlayTwo = () => (
		<ModalOverlay
			bg="transparent"
			backdropFilter="auto"
			backdropInvert="80%"
			backdropBlur="2px"
		/>
	);

	const [loading, setLoading] = useState(false); // if the user is already updating the profile, don't do anything (prevent spamming the button) it will show loading spinner
	const [postText, setPostText] = useState("");
	const [postDescription, setPostDescription] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(); // custom hook coming from hooks folder
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [remainingErrorTitle, setRemainingChar] = useState(maxCharTitle); //limit the max char of the title to 500
	const [remainingErrorDescription, setRemainingErrorDescription] =
		useState(maxCharDescription); //limit the max char of the description to 1500

	const [overlay, setOverlay] = React.useState(<OverlayOne />);

	const imageRef = React.useRef(null);
	const showToast = useShowToast(); // custom hook coming from hooks folder
	const user = useRecoilValue(userAtom); //the logged in user data

	const handleTitleChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length > maxCharTitle) {
			// if the user exceed the max char limit, then truncate it to the max char limit
			const truncate = inputText.slice(0, maxCharTitle);
			setPostText(truncate);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(maxCharTitle - inputText.length);
		}
	};

	const handleErrorDiscChange = (e) => {
		const inputDescription = e.target.value;
		if (inputDescription.length > maxCharDescription) {
			// if the user exceed the max char limit, then truncate it to the max char limit
			const truncate = inputDescription.slice(0, maxCharDescription);
			setPostDescription(truncate);
			setRemainingErrorDescription(0);
		} else {
			setPostDescription(inputDescription);
			setRemainingErrorDescription(
				maxCharDescription - inputDescription.length
			);
		}
	};
	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/posts/create", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					errorDisc: postDescription,
					img: imgUrl,
				}),
			});
			const data = await res.json();
			console.log(data);
			if (data.error) {
				console.log("error from handleCreatePost : ", data.error);
				showToast("error", data.error, "error");
				return;
			}
			showToast(
				"success",
				"your error has been posted..! soon you will find the solution.",
				"success"
			);
			onClose();
      setImgUrl(null);
      setPostText("");
      setPostDescription("");
		} catch (error) {
			console.log("error from handleCreatePost : ", error);
			showToast("error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				ml="4"
				position={"fixed"}
				bottom={10}
				right={10}
				size={"sm"}
				leftIcon={<AddIcon />}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={() => {
					setOverlay(<OverlayTwo />);
					onOpen();
				}}>
				Got Error ?
			</Button>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				{overlay}
				<ModalContent>
					<ModalHeader>Write your error</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder="title of your error {max : 500w}"
								mb={2}
								onChange={handleTitleChange}
								value={postText}
							/>
							<Text
								fontSize={"xs"}
								textAlign={"right"}
								m={1}
								mb={4}
								color={"gray.800"}>
								{remainingErrorTitle}/{maxCharTitle} words
							</Text>

							<Textarea
								placeholder="your error description here {max : 2000w}"
								onChange={handleErrorDiscChange}
								value={postDescription}
								mb={2}
							/>
							<Text
								fontSize={"xs"}
								textAlign={"right"}
								m={1}
								mb={2}
								color={"gray.800"}>
								{remainingErrorDescription}/{maxCharDescription} words
							</Text>
							<Input
								type="file"
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>
							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={36}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>
						{imgUrl && (
							<Flex mt={5} position={"relative"}>
								<Image src={imgUrl} alt="error image" />
								<CloseButton
									onClick={() => setImgUrl(null)}
									position={"absolute"}
									bg={"gray.800"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
						<Text mt={4}>Upload Error Image or Screenshot📷</Text>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleCreatePost} isLoading={loading}>ASK</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
