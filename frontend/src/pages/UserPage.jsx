import { useEffect, useState } from "react";
import { UserHeader } from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postAtom";

const UserPage = () => {

  // const [user, setUser] = useState(null); //set the user data in the component's state
  const [posts, setPosts] = useRecoilState(postsAtom); //set the posts data in the component's state
  const [fetchingPosts, setFetchingPosts] = useState(true); //set the posts data in the component's state
  const showToast = useShowToast(); // custom hook coming from hooks folder
  // import the getUser function when the component mounts or when the values of username or showToast change
  const {user , loading} = useGetUserProfile()
  const { username } = useParams(); // get the username from the url
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define an asynchronous function called getUser
    //1. getUser will find the profile of user
    

		const getUserPosts = async () => {
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				if(data.error) {
					console.log("error from userPage: ", data.error);
					showToast("fail", data.error, "error");
					return;
				}
				setPosts(data);
			} catch (error) {
			showToast("fail", error.message, "error");	
			setPosts([]);
			}finally{
				setFetchingPosts(false);
			}
		}
    

    
    getUserPosts();
    // Specify the dependencies for the useEffect hook, in this case, username and showToast
  }, [username, showToast , setPosts]);

	console.log("posts is here it is recoil state ", posts);
  if (loading && !user) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>user not found</h1>;
	
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && 
				<Flex justify={"center"} align={"center"} mt={20} fontSize={20}>	
					<h1>No Questions or Answers to show🥲😥</h1>
          </Flex>
			
			}
      {fetchingPosts && (
        <Flex justify={"center"} align={"center"} mt={20}>
          <Spinner size={"xl"} />
        </Flex>
      )}
			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy}  />
			))}
      
    </>
  );
};

export default UserPage;
