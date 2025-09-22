import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  try {
    console.log('=== Sign-In Page Check ===');
    
    const headersList = await headers();
    console.log('Sign-in page headers:', {
      host: headersList.get('host'),
      origin: headersList.get('origin'),
      cookie: headersList.get('cookie') ? 'Present' : 'Missing'
    });
    
    const session = await auth.api.getSession({
      headers: headersList,
    });

    console.log('Sign-in page session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      sessionId: session?.session?.id
    });

    // Check if session has user data
    if (session?.user) {
      console.log("✅ User already authenticated, redirecting to home");
      redirect("/")
    }
    
    console.log("ℹ️ No active session, showing sign-in page");
  } catch (error) {
    // If there's an error getting the session, just continue to show sign-in
    console.log("⚠️ Error checking session on sign-in page:", error);
    console.log("Continuing to show sign-in page");
  }

  return <SignInView />;
};

export default SignInPage;
