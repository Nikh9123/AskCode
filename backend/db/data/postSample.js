const samplePostData = [
	{
		postedBy: "652eb914afb7bdff683aeea6",
		text: "Having trouble with my code. Can someone help?",
		img: "https://example.com/image1.jpg",
		errorDisc: "Error description for the first post.",

		likes: ["652eb914afb7bdff683aeea8", "652eb914afb7bdff683aeea9"],
		replies: [
			{
				userId: "652eb914afb7bdff683aeea7",
				text: "Sure, I can help you with that.",
				userProfilePic: "https://example.com/profilepic1.jpg",
				username: "helper1",
			},
			{
				userId: "652eb914afb7bdff683aeea8",
				text: "What programming language are you using?",
				userProfilePic: "https://example.com/profilepic2.jpg",
				username: "helper2",
			},
		],
	},
	{
		postedBy: "652eb914afb7bdff683aeea8",
		text: "I found a bug in my code, need assistance!",
		img: null,
		errorDisc: "Error description for the second post.",
		likes: ["652eb914afb7bdff683aeea6"],
		replies: [
			{
				userId: "652eb914afb7bdff683aeeac",
				text: "Could you provide more details about the bug?",
				userProfilePic: "https://example.com/profilepic3.jpg",
				username: "helper3",
			},
		],
	},
	// {
	// 	postedBy: "user777",
	// 	text: "Need help optimizing my code for better performance.",
	// 	img: null,
	// 	likes: ["user888", "user999"],
	// 	replies: [
	// 		{
	// 			userId: "user888",
	// 			text: "Consider using a hash table for faster lookups.",
	// 			userProfilePic: "https://example.com/profilepic4.jpg",
	// 			username: "helper4",
	// 		},
	// 		{
	// 			userId: "user999",
	// 			text: "You can also try memoization to reduce redundant calculations.",
	// 			userProfilePic: "https://example.com/profilepic5.jpg",
	// 			username: "helper5",
	// 		},
	// 	],
	// },
	// {
	// 	postedBy: "user444",
	// 	text: "Looking for recommendations on a good JavaScript library for data visualization.",
	// 	img: null,
	// 	likes: ["user555"],
	// 	replies: [
	// 		{
	// 			userId: "user555",
	// 			text: "D3.js is a powerful library for data visualization in JavaScript.",
	// 			userProfilePic: "https://example.com/profilepic6.jpg",
	// 			username: "helper6",
	// 		},
	// 	],
	// },
	// {
	// 	postedBy: "user666",
	// 	text: "Found a solution to my problem! Sharing it with everyone.",
	// 	img: null,
	// 	likes: ["user123", "user789", "user210"],
	// 	replies: [
	// 		{
	// 			userId: "user123",
	// 			text: "Thanks for sharing! This will help others facing similar issues.",
	// 			userProfilePic: "https://example.com/profilepic7.jpg",
	// 			username: "helper7",
	// 		},
	// 	],
	// },
	// {
	// 	postedBy: "user111",
	// 	text: "How can I implement authentication in my Node.js app?",
	// 	img: null,
	// 	likes: ["user222"],
	// 	replies: [
	// 		{
	// 			userId: "user222",
	// 			text: "You can use Passport.js for authentication in Node.js. It's easy to integrate and supports various authentication methods.",
	// 			userProfilePic: "https://example.com/profilepic8.jpg",
	// 			username: "helper8",
	// 		},
	// 	],
	// },
	// {
	// 	postedBy: "user333",
	// 	text: "Looking for a code review for my React component.",
	// 	img: null,
	// 	likes: ["user444"],
	// 	replies: [
	// 		{
	// 			userId: "user444",
	// 			text: "Sure, I can review your code. Please share the repository link.",
	// 			userProfilePic: "https://example.com/profilepic9.jpg",
	// 			username: "helper9",
	// 		},
	// 	],
	// },
];

export default samplePostData;
