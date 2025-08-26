import { Homeview } from "@/modules/home/ui/view/home-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers(),
    });

    console.log('Session check on root page:', session ? 'Session found' : 'No session');

    if (!session) {
      redirect("/sign-in");
    }

    return <Homeview />;
  } catch (error) {
    console.error('Error checking session on root page:', error);
    redirect("/sign-in");
  }
}
