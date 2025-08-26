import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if session has user data
    if (session?.user) {
      console.log("User already authenticated, redirecting to home");
      redirect("/")
    }
  } catch (error) {
    // If there's an error getting the session, just continue to show sign-in
    console.log("No active session, showing sign-in page");
  }

  return <SignInView />;
};

export default SignInPage;
