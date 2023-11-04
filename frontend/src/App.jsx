import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
	const user = useRecoilValue(userAtom);
	return (
		<Container maxW="620px">
			<Header />
			<Routes>
			<Route path="/auth" element={ !user ? <AuthPage /> : <Navigate to={'/'}/>} />
			<Route path="/" element={ user ? <HomePage /> : <Navigate to={'/auth'}/>} />
			{/* <Route path="/login" element={ user ? <HomePage /> : <Navigate to={'/auth'}/>} /> */}
			<Route path="/updateMe" element={ user ? <UpdateProfilePage /> : <Navigate to={'/auth'}/>} />

				<Route path="/:username" element={<UserPage />} />
				<Route path="/:username/post/:pid" element={<PostPage />} />
			</Routes>

			{user && <LogoutButton/>}
			{user && <CreatePost/>}
		</Container>


	);
}

export default App;
