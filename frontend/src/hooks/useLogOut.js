import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogOut = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const logOut = async () => {
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
		}
	};
  return logOut ;
}

export default useLogOut