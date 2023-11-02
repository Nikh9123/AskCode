import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignUp"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
  const authscreenState = useRecoilValue(authScreenAtom);
  console.log(authscreenState) ;
  return (
    <>{authscreenState === "login" ? <LoginCard/> : <SignupCard/>}</>

  )
}

export default AuthPage