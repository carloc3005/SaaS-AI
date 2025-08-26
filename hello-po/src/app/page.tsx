import { Homeview } from "@/modules/home/ui/view/home-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers(),
    });

    console.log('Root page session check:', session);

    // Check if session has user data
    if (!session?.user) {
      console.log("No session found, redirecting to sign-in");
      redirect("/sign-in");
    }

    console.log("Session found, showing home page");
    return <Homeview />;
  } catch (error) {
    console.error('Error checking session on root page:', error);
    redirect("/sign-in");
  }
}
