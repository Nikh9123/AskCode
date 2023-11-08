import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
	IconButton,
} from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { useEffect,  } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import { CopyIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postAtom";


const PostPage = () => {
  const showToast = useShowToast();
  const { user, loading } = useGetUserProfile();
  const currentUser = useRecoilValue(userAtom);
  const { pid } = useParams();
	const navigate = useNavigate();
  const[posts,setPosts] = useRecoilState(postsAtom); //set the posts data in the component's state
  //copy post url
  const toast = useToast();

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
  const currentPost = posts[0] ;
  console.log("current post is ",currentPost);
  useEffect(() => {
    const getPost = async () => {

      setPosts([]);
      try {
        console.log("pid: ", pid);
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          console.log("error from getpost: ", data.error);
          showToast("fail", data.error, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        console.log("error from getpost: ", error.message);
        showToast("fail", error.message, "error");
      }
    };
    getPost();
  }, [pid, showToast , setPosts]);
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/delete/${currentPost._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      showToast("success", data.message, "success");
      //refresh the page
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("error", error.message, "error");
    }
  };
  if(!currentPost)
  {
    return null ;
  }
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (! currentPost && !loading) {
    return <h1>post not found</h1>;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={4}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"md"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} m={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontStyle={"sm"} color={"gray.light"} width={150}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <Menu>
						<MenuButton
							as={IconButton}
							aria-label='Options'
							icon={<HamburgerIcon />}
							variant='outline'
						/>
						<MenuList>
							<MenuItem icon={<CopyIcon /> } onClick={copyURL}>
								copy link
							</MenuItem>
							<MenuItem icon={<DeleteIcon />}onClick={handleDeletePost}>
								delete post
							</MenuItem>
						</MenuList>
					</Menu>
          )}
          {currentUser?._id != user._id && (
            <CopyIcon boxSize={4} onClick={copyURL} cursor={"pointer"} />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      {currentPost.errorDisc && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          borderColor={"gray.light"}
          marginTop={2}
        >
          <Text
            fontSize={{
              base: "xs",
              md: "sm",
              lg: "md",
            }}
            cursor={"auto"}
          >
            {currentPost.errorDisc}
         </Text>
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} align={"center"}>
          <Text fontSize={"2xl"}>☝️</Text>
          <Text color={"gray.light"}>Get the app to reply, post and ask.</Text>
        </Flex>
        <Button colorScheme={"blue"} justifyContent={"center"}>
          Get
        </Button>
      </Flex>

      <Divider my={3} />
			{currentPost.replies.map((reply) => (
        <Comment key={reply._id} reply={reply} 
        
      />
      ))}
      </>
  );
};

export default PostPage;
