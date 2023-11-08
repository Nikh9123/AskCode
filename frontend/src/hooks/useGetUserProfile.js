import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Make an HTTP request to the specified API endpoint using fetch
        const res = await fetch(`/api/user/profile/${username}`);

        // Parse the JSON response from the API
        const data = await res.json();

        // Check if the response contains an error
        if (data.error) {
          // If there's an error, log it to the console and show a toast notification with the error message
          console.log("error from userPage: ", data.error);
          showToast("fail", data.error, "error");
          return;
        }
        // If there are no errors, set the user data in the component's state using the setUser function
        setUser(data.data.user);
      } catch (error) {
        // If there's an error during the fetch operation, log it to the console and show a toast notification with the error message
        console.log(error);
        showToast("fail", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);
  return { user, loading };
};

export default useGetUserProfile;
