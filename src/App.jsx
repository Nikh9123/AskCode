import { Button, Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";

function App() {
	return (
		<Container maxW="620px">
			<Routes>
				<Route path="/:username" element={<UserPage />} />
				<Route path="/:username/post/:pid" element={<PostPage />} />
			</Routes>
		</Container>
	);
}

export default App;
