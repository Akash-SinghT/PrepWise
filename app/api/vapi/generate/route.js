import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  try {
    // Parse the incoming JSON request body
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // Generate interview questions by calling AI text generation function
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Construct the interview object to be saved in the database
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","), // Convert comma-separated string into array
      questions: JSON.parse(questions), // Parse questions string to array
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(), // Random cover image
      createdAt: new Date().toISOString(), // Timestamp
    };

    // Save interview to Firestore collection "interviews"
    await db.collection("interviews").add(interview);

    // Return success response with status 200
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    // Return failure response with error message and status 500
    return Response.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

// Simple GET handler for API check
export async function GET() {
  // Properly return JSON response with status 200
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
