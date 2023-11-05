import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
// import { HiOutLineLogout } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";

import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const [loading , setLoading] = useState(false);

	const handleLogout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/user/signout", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			console.log(data.status);
			//clear the local storage

			if (data.error) {
				showToast("fail", "Logout failed", "Logout failed");
				return;
			}
			// showToast("success", "you have been logged out", "Logout");
			localStorage.removeItem("askcode-user");
			setUser(null);
		} catch (error) {
			console.log("error from LogoutButton : ", error);
			showToast("error", "logout failed. try after some time", "Logout failed");
		}finally{
			setLoading(false);
		}
	};

	return (
		<Button
			position={"fixed"}
			top={"10px"}
			right={"30px"}
			size={"lg"}
			isLoading={loading}
			onClick={handleLogout}>
			{/* Logout */}
			{/* <HiOutLineLogout /> */}
			<IoLogOutOutline size={20}/>
		</Button>
	);
};

export default LogoutButton;
