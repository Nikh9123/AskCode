import { useEffect, useState } from "react";
import { UserHeader } from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";


const UserPage = () => {
	const [user, setUser] = useState(null);//set the user data in the component's state

	const showToast = useShowToast(); // custom hook coming from hooks folder

	const { username } = useParams(); // get the username from the url


	useEffect(() => {
		// Define an asynchronous function called getUser
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
        if(!data.data.user)
				{
					showToast("fail", "user not found", "error");
					return ;
				}
				// If there are no errors, set the user data in the component's state using the setUser function
				setUser(data.data.user);
			} catch (error) {
				// If there's an error during the fetch operation, log it to the console and show a toast notification with the error message
				console.log(error);
				showToast("fail", error, "error");
			}
		};

		// Call the getUser function when the component mounts or when the values of username or showToast change
		getUser();

		// Specify the dependencies for the useEffect hook, in this case, username and showToast
	}, [username, showToast]);
	if (!user) return null;
	return (
		<>
			<UserHeader user={user} />
			<UserPost
				likes={1200}
				replies={481}
				postImg="/post1.png"
				postTitle="let's talk about ask code"
			/>
			<UserPost
				likes={321}
				replies={81}
				postImg="/error1.png"
				postTitle="Error with running c programme in visual studio code "
			/>
			<UserPost
				likes={126}
				replies={8}
				postImg="/error2.jpg"
				postTitle="Ubuntu internal error"
			/>
			<UserPost
				likes={109}
				replies={41}
				postImg="/error3.png"
				postTitle="Ubuntu GPG error"
			/>
			<UserPost
				likes={109}
				replies={41}
				postTitle="React Native Error"
				postDesc="C:\Users\dip\AwesomeProject>react-native run-android 'yarn' is not recognized as an internal or external command, operable program or batch file.
Scanning 557 folders for symlinks in C:\Users\dip\AwesomeProject\node_mo ules (31ms)
JS server already running.
Building and installing the app on the device (cd android && gradlew.bat instal Debug)...
Error occurred during initialization of VM
java/lang/NoClassDefFoundError: java/lang/Object
Could not install the app on the device, read the error above for details. Make sure you have an Android emulator running or a device connected and have set up your Android development environment:
https://facebook.github.io/react-native/docs/android-setup.html"
			/>
		</>
	);
};

export default UserPage;
