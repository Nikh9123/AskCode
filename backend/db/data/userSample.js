const sampleUsers = [
	{
		name: "Alice Johnson",
		username: "alice123",
		email: "alice@example.com",
		password: "password123",
		passwordConfirm: "password123",
		profilePic: "profile1.jpg",
		followers: ["bob123", "charlie456"],
		following: ["dave789"],
		bio: "Web Developer",
		createdAT: new Date(),
	},
	{
		name: "Bob Smith",
		username: "bob123",
		email: "bob@example.com",
		password: "bobpassword",
		passwordConfirm: "bobpassword",
		profilePic: "profile2.jpg",
		followers: ["alice123"],
		following: ["charlie456"],
		bio: "Designer",
		createdAT: new Date(),
	},
	{
		name: "Charlie Brown",
		username: "charlie456",
		email: "charlie@example.com",
		password: "charliepassword",
		passwordConfirm: "charliepassword",
		profilePic: "profile3.jpg",
		followers: ["alice123", "bob123"],
		following: ["dave789"],
		bio: "Content Creator",
		createdAT: new Date(),
	},
	{
		name: "David Johnson",
		username: "dave789",
		email: "dave@example.com",
		password: "davepassword",
		passwordConfirm: "davepassword",
		profilePic: "profile4.jpg",
		followers: ["charlie456"],
		following: ["alice123", "bob123"],
		bio: "Photographer",
		createdAT: new Date(),
	},
	{
		name: "Eva Davis",
		username: "eva567",
		email: "eva@example.com",
		password: "evapassword",
		passwordConfirm: "evapassword",
		profilePic: "profile5.jpg",
		followers: ["bob123"],
		following: ["alice123", "charlie456"],
		bio: "Artist",
		createdAT: new Date(),
	},
	{
		name: "Frank White",
		username: "frank789",
		email: "frank@example.com",
		password: "frankpassword",
		passwordConfirm: "frankpassword",
		profilePic: "profile6.jpg",
		followers: ["alice123", "charlie456"],
		following: ["bob123"],
		bio: "Musician",
		createdAT: new Date(),
	},
	{
		name: "Grace Lee",
		username: "grace234",
		email: "grace@example.com",
		password: "gracepassword",
		passwordConfirm: "gracepassword",
		profilePic: "profile7.jpg",
		followers: ["dave789"],
		following: ["alice123", "bob123"],
		bio: "Writer",
		createdAT: new Date(),
	},
	{
		name: "Henry Baker",
		username: "henry789",
		email: "henry@example.com",
		password: "henrypassword",
		passwordConfirm: "henrypassword",
		profilePic: "profile8.jpg",
		followers: ["alice123", "charlie456"],
		following: ["bob123"],
		bio: "Chef",
		createdAT: new Date(),
	},
	{
		name: "Ivy Green",
		username: "ivy567",
		email: "ivy@example.com",
		password: "ivypassword",
		passwordConfirm: "ivypassword",
		profilePic: "profile9.jpg",
		followers: ["bob123"],
		following: ["alice123", "charlie456"],
		bio: "Fitness Trainer",
		createdAT: new Date(),
	},
	{
		name: "Jack Turner",
		username: "jack345",
		email: "jack@example.com",
		password: "jackpassword",
		passwordConfirm: "jackpassword",
		profilePic: "profile10.jpg",
		followers: ["alice123", "charlie456"],
		following: ["bob123"],
		bio: "Travel Blogger",
		createdAT: new Date(),
	},
];

export default sampleUsers;
// You can use these sampleUsers in your application
