// Sure! Here’s a simple explanation:

// What is signUpParams?
// It’s just a container (object) that holds all the information needed to create a new user account, like name, email, and password — all in one place.

// Why do we use it?
// To send all related info together instead of separately.

// To keep things organized so the sign-up function gets everything it needs in one object.

// To make the code cleaner and easier to manage.

// To make it easier to add or remove information later without changing a lot of code.

// Imagine it like this:
// If you want to tell someone your address, instead of giving each part separately ("Street", "City", "Zip"), you give them a single address card with everything on it.

// Similarly, signUpParams is like the “address card” but for user info.

// So, it’s just a simple way to group all sign-up data together to pass around in your code.
const feedback = {
  id: "",
  interviewId: "",
  totalScore: 0,
  categoryScores: [
    {
      name: "",
      score: 0,
      comment: "",
    },
  ],
  strengths: [],
  areasForImprovement: [],
  finalAssessment: "",
  createdAt: "",
};

const interview = {
  id: "",
  role: "",
  level: "",
  questions: [],
  techstack: [],
  createdAt: "",
  userId: "",
  type: "",
  finalized: false,
};

const createFeedbackParams = {
  interviewId: "",
  userId: "",
  transcript: [{ role: "", content: "" }],
  feedbackId: undefined,
};

const user = {
  name: "",
  email: "",
  id: "",
};

const interviewCardProps = {
  interviewId: "",
  userId: "",
  role: "",
  type: "",
  techstack: [],
  createdAt: "",
};

const agentProps = {
  userName: "",
  userId: "",
  interviewId: "",
  feedbackId: "",
  type: "generate", // or 'interview'
  questions: [],
};

const routeParams = {
  params: Promise.resolve({}),
  searchParams: Promise.resolve({}),
};

const getFeedbackByInterviewIdParams = {
  interviewId: "",
  userId: "",
};

const getLatestInterviewsParams = {
  userId: "",
  limit: 10,
};

const signInParams = {
  email: "",
  idToken: "",
};

const signUpParams = {
  uid: "",
  name: "",
  email: "",
  password: "",
};

const formType = {
  SIGN_IN: "sign-in",
  SIGN_UP: "sign-up",
};

const interviewFormProps = {
  interviewId: "",
  role: "",
  level: "",
  type: "",
  techstack: [],
  amount: 0,
};

const techIconProps = {
  techStack: [],
};
