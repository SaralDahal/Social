export const currentUser = {
  id: "1",
  name: "Arjun Mehta",
  username: "arjunm",
  avatar: "",
  bio: "Civic activist. Raising awareness one post at a time.",
  followers: 842,
  following: 215,
  postsCount: 56,
};

export const users = [
  currentUser,
  {
    id: "2",
    name: "Priya Sharma",
    username: "priyasharma",
    avatar: "",
    bio: "Environmental advocate and community organizer.",
    followers: 1203,
    following: 340,
    postsCount: 89,
  },
  {
    id: "3",
    name: "Rahul Gupta",
    username: "rahulg",
    avatar: "",
    bio: "Fighting for transparent governance.",
    followers: 567,
    following: 120,
    postsCount: 34,
  },
  {
    id: "4",
    name: "Anita Desai",
    username: "anitad",
    avatar: "",
    bio: "Women's rights advocate and educator.",
    followers: 2100,
    following: 180,
    postsCount: 112,
  },
  {
    id: "5",
    name: "Vikram Singh",
    username: "vikrams",
    avatar: "",
    bio: "Road safety awareness campaigns.",
    followers: 390,
    following: 95,
    postsCount: 27,
  },
];

export const posts = [
  {
    id: "1",
    author: users[1],
    content:
      "The river near our locality has been polluted with industrial waste for months. We need collective action and proper reporting to the pollution control board. Has anyone filed an RTI about this?",
    category: "Environment",
    likes: 234,
    dislikes: 12,
    comments: 45,
    shares: 89,
    createdAt: "2h ago",
    liked: false,
    disliked: false,
  },
  {
    id: "2",
    author: users[2],
    content:
      "Potholes on MG Road have caused 3 accidents this week alone. The municipal corporation has been ignoring complaints for over 6 months. Sharing documented evidence collected by our community group.",
    category: "Infrastructure",
    likes: 567,
    dislikes: 8,
    comments: 123,
    shares: 201,
    createdAt: "4h ago",
    liked: true,
    disliked: false,
  },
  {
    id: "3",
    author: users[3],
    content:
      "Free legal aid camp this Saturday at Community Hall, Sector 15. Lawyers volunteering to help women file domestic violence complaints and understand their legal rights. Spread the word.",
    category: "Women's Rights",
    likes: 892,
    dislikes: 3,
    comments: 67,
    shares: 445,
    createdAt: "6h ago",
    liked: false,
    disliked: false,
  },
  {
    id: "4",
    author: users[4],
    content:
      "Documented the dangerous school zone on NH-48 where there are no speed breakers or pedestrian crossings. Three children were injured last month. Tagging the local authorities for immediate action.",
    category: "Road Safety",
    likes: 345,
    dislikes: 5,
    comments: 78,
    shares: 156,
    createdAt: "8h ago",
    liked: false,
    disliked: false,
  },
  {
    id: "5",
    author: users[0],
    content:
      "Water supply has been irregular in Block C for the past 2 weeks. Despite multiple complaints to the water board, there has been no response. Organizing a peaceful demonstration this Friday.",
    category: "Basic Amenities",
    likes: 178,
    dislikes: 15,
    comments: 34,
    shares: 67,
    createdAt: "12h ago",
    liked: false,
    disliked: false,
  },
];

export const complaints = [
  {
    id: "1",
    author: users[1],
    title: "Industrial waste dumping in Yamuna tributary",
    description:
      "Factory XYZ has been dumping untreated chemical waste into the river for the past 3 months. Water has turned dark and aquatic life is dying.",
    category: "Environment",
    status: "in-progress",
    upvotes: 342,
    location: "Sector 12, Industrial Area",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    author: users[2],
    title: "Broken streetlights on Ring Road stretch",
    description:
      "15+ streetlights not working between KM 12-18 on Ring Road. Multiple accidents reported at night. Authorities notified but no action taken.",
    category: "Infrastructure",
    status: "open",
    upvotes: 189,
    location: "Ring Road, KM 12-18",
    createdAt: "5 days ago",
  },
  {
    id: "3",
    author: users[3],
    title: "Overflowing garbage at market square",
    description:
      "Garbage collection has stopped for 2 weeks at the main market. The stench is unbearable and it is a serious health hazard for vendors and customers.",
    category: "Sanitation",
    status: "resolved",
    upvotes: 567,
    location: "Main Market, Old Town",
    createdAt: "1 week ago",
  },
  {
    id: "4",
    author: users[4],
    title: "Missing traffic signals at school zone",
    description:
      "The intersection near Government School has no traffic signals. Children cross busy roads during peak hours without any safety measures.",
    category: "Road Safety",
    status: "open",
    upvotes: 423,
    location: "Near Govt. School, NH-48",
    createdAt: "3 days ago",
  },
];

export const sampleComments = [
  {
    id: "1",
    author: users[2],
    content:
      "This is exactly what our community needs. I have been facing the same issue for months.",
    createdAt: "1h ago",
    likes: 23,
  },
  {
    id: "2",
    author: users[3],
    content:
      "Filed a complaint with the local office last week. Still waiting for a response.",
    createdAt: "2h ago",
    likes: 15,
  },
  {
    id: "3",
    author: users[4],
    content:
      "We should organize a peaceful march to bring more visibility to this issue.",
    createdAt: "3h ago",
    likes: 45,
  },
];

export const categories = [
  "All",
  "Environment",
  "Infrastructure",
  "Road Safety",
  "Women's Rights",
  "Sanitation",
  "Basic Amenities",
  "Education",
  "Healthcare",
  "Governance",
];

export const trendingTopics = [
  { tag: "CleanWaterForAll", posts: 1240 },
  { tag: "FixOurRoads", posts: 890 },
  { tag: "SafeSchoolZones", posts: 567 },
  { tag: "RightToInformation", posts: 445 },
  { tag: "GreenCityMovement", posts: 334 },
];
