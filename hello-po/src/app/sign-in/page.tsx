import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user) {
      redirect("/")
    }
  } catch (error) {
    // If there's an error getting the session, just continue to show sign-in
    console.log("Error checking session on sign-in page:", error);
  }

  return <SignInView />;
};

export default SignInPage;
