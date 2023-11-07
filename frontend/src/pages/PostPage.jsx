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
	theme,
} from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import {
  CopyIcon,
} from "@chakra-ui/icons";

const PostPage = () => {
  const [liked, setLiked] = useState(false);

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

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={4}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Nikhil Satyam" />
          <Flex>
            <Text fontSize={"md"} fontWeight={"bold"}>
              nikh9123
            </Text>
            <Image src="/verified.png" w={4} h={4} m={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <Flex>
            <Menu>
              <MenuButton>
                <CopyIcon />
              </MenuButton>
              <MenuList initialcolormode={theme.config.initialColorMode}>
                <MenuItem initialcolormode={theme.config.initialColorMode} onClick={copyURL}>
                  copy post link
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Flex>
      <Text my={3}>Let&apos;s talk about errors</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/error1.png"} w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          56 replies
        </Text>
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
      <Comment
        comment="Looks really good!"
        createdAt="2d"
        likes={100}
        username="johndoe"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        comment="Amazing!"
        createdAt="1d"
        likes={21}
        username="janedoe"
        userAvatar="https://bit.ly/code-beast"
      />
      <Comment
        comment="Looks good!"
        createdAt="2d"
        likes={42}
        username="sallydoe"
        userAvatar="https://bit.ly/sage-adebayo"
      />
    </>
  );
};

export default PostPage;
