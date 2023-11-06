import {
  Box,
  Button,
  Flex,
  Textarea,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { set } from "date-fns";

const Actions = ({ post: _post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reply , setReply] = useState(''); // reply is the answer to the question
  //if user is logged in and he has liked the post then set liked to true else false
  const [post, setPost] = useState(_post); //_post is the post that is passed from the parent component
  const user = useRecoilValue(userAtom); //user is the user that is logged in
  const [liked, setLiked] = useState(
    _post?.likes?.includes(user?._id) || false
  ); // if user is logged in and he has liked the post then set liked to true else false
  const [liking, setLiking] = useState(false); // to prevent multiple clicks on like button
  const showToast = useShowToast();

  const handleLikeAndUnlike = async () => {
    if (liking) return;
    setLiking(true);
    if (!user) {
      showToast(
        "Error",
        "You must login first to like or dislike a post",
        "error"
      );
    }
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.log("error : ", data.error);
        showToast("Error", data.error, "error");
      }
      if (liked) {
        setPost({
          ...post,
          likes: post.likes.filter((like) => like !== user._id),
        });
      } else {
        setPost({ ...post, likes: [...post.likes, user._id] });
      }
      setLiked(!liked);
    } catch (error) {
      console.log("error from HandleLikedUnlike : ", error.message);
      showToast("Error", error.message, "error");
    } finally {
      setLiking(false);
    }
  };
  const handleReply = async () => {
		if (!user) {
			showToast(
				"Error",
				"You must login first to reply to a post",
				"error"
			);
		}
		try {
			const res = await fetch(`/api/posts/reply/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: reply }),
			});
			const data = await res.json();
			console.log(data);
			if (data.error) {
				console.log("error : ", data.error);
				showToast("Error", data.error, "error");
			}
			setPost({ ...post, replies: [...post.replies, data.reply] });
			setReply('');
			onClose();
		} catch (error) {
			console.log("error from HandleReply : ", error.message);
			showToast("Error", error.message, "error");
		}
	};
  if (!post) {
    return <div>Loading...</div>; // or show an error message
  }
  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
          cursor={"pointer"}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          cursor={"pointer"}
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
        <RePostSvg />
        <ShareSvg />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text
          color={"gray.light"}
          fontSize={{
            base: "xs",
            md: "sm",
            lg: "md",
          }}
        >
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
          cursor={"pointer"}
        >
          {post.replies.length} replies
        </Text>
      </Flex>

			<Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Answer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Textarea placeholder="Your answer | | question"
                value={reply}
                onChange={(e) => setReply(e.target.value)}>
              
            </Textarea>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleReply}>
              Post
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
</Modal>

    </Flex>
  );
};

const RePostSvg = () => {
  return (
    <svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      cursor={"pointer"}
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  );
};

const ShareSvg = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      cursor={"pointer"}
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};

export default Actions;
