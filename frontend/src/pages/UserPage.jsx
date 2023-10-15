import { UserHeader } from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
	return (
		<>
			<UserHeader />
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
