import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AuthCallbackPage() {
  console.log('Auth callback page accessed');
  
  try {
    // Wait a moment for session to be established
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const session = await auth.api.getSession({ 
      headers: await headers(),
    });

    console.log('Auth callback session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userEmail: session?.user?.email
    });

    if (session?.user?.id) {
      console.log("Session found in callback, redirecting to home");
      redirect("/");
    } else {
      console.log("No session in callback, redirecting to sign-in");
      redirect("/sign-in");
    }
  } catch (error) {
    console.error('Error in auth callback:', error);
    redirect("/sign-in");
  }

  return null;
}
