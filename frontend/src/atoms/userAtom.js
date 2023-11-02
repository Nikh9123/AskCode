import { atom } from "recoil";
const userAtom = atom({
	key: "userAtom",
	default: JSON.parse(localStorage.getItem("askcode-user")),
});

export default userAtom;
