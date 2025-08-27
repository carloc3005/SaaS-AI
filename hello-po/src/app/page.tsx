import { Homeview } from "@/modules/home/ui/view/home-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers(),
    });

    console.log('Root page session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userEmail: session?.user?.email,
      sessionToken: session?.session?.id
    });

    // Check if session has user data with more lenient check
    if (!session?.user?.id) {
      console.log("No valid session found, redirecting to sign-in");
      redirect("/sign-in");
    }

    console.log("Valid session found, showing home page for user:", session.user.email);
    return <Homeview />;
  } catch (error) {
    console.error('Error checking session on root page:', error);
    redirect("/sign-in");
  }
}
