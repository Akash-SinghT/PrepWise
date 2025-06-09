"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/Actions/auth.action";
// Craete Schema
const authFormSchema = (type) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters")
        : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });
};

const AuthForm = ({ type }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handles form submission for both sign-up and sign-in
  async function onSubmit(values) {
    // 'values' is validated using Zod schema before this runs
    try {
      // 🔐 SIGN-UP FLOW
      if (type === "sign-up") {
        const { name, email, password } = values;

        // 1️⃣ Create a new user using Firebase Auth
        const userCredentials = await createUserWithEmailAndPassword(
          auth, // Firebase Auth instance
          email, // User's email
          password // User's password
        );

        // 2️⃣ Store additional user info (like name) in your backend DB
        const result = await signUp({
          uid: userCredentials.user.uid, // Firebase UID
          name,
          email,
          password,
        });

        // 3️⃣ If the backend response is not successful, show error
        if (!result?.success) {
          toast.error(result?.message); // Show backend error message
          return;
        }

        // 4️⃣ Show success toast and redirect to the sign-in page
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        // 🔓 SIGN-IN FLOW
        const { email, password } = values;

        // 1️⃣ Authenticate user with Firebase (client-side)
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // 2️⃣ Retrieve Firebase ID token (JWT)
        const idToken = await userCredentials.user.getIdToken();

        // 3️⃣ If token fetch fails, show error and stop
        if (!idToken) {
          toast.error("Sign in failed.");
          return;
        }

        // 4️⃣ Send token and email to backend to set secure session cookie
        await signIn({
          email,
          idToken,
        });

        // 5️⃣ Show success toast and redirect to homepage
        toast.success("Sign in successfully.");
        router.push("/");

        console.log("SIGN IN", values); // Optional debug info
      }
    } catch (error) {
      // ⚠️ Handle unexpected errors
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No acoount yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
