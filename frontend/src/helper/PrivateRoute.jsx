import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Navigate, Route } from "react-router-dom";



const PrivateRoute = ({ element, redirectTo = '/auth', ...rest }) => {
  const user = useRecoilValue(userAtom);

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <Route {...rest} element={element} />;
}

export default PrivateRoute;