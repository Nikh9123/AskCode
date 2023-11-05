import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
	const showToast = useShowToast();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/posts/feed", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await res.json();
				console.log(data.data);
				if (data.error) {
					showToast("error", data.error, "error");
					return;
				}
				setPosts(data.data);
			} catch (error) {
				console.log("error from HomePage : ", error);
				showToast("error", error, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast]);

	return (
		<>
    {!loading && posts.length === 0 && (
				<h1>No posts to show🥲😥. Follow someone to see the feed</h1>
			)}
			{loading && (
				<Flex justify={"center"} align={"center"} mt={20}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
		</>
	);
};

export default HomePage;
