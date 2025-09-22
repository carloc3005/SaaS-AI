import { Homeview } from "@/modules/home/ui/view/home-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  try {
    console.log('=== Root Page Session Check ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Auth baseURL:', process.env.BETTER_AUTH_URL || 'localhost:3000');
    
    const headersList = await headers();
    console.log('Request headers:', {
      host: headersList.get('host'),
      origin: headersList.get('origin'),
      'user-agent': headersList.get('user-agent')?.substring(0, 50) + '...',
      cookie: headersList.get('cookie') ? 'Present' : 'Missing',
      cookieDetails: headersList.get('cookie')?.substring(0, 200) || 'No cookies'
    });
    
    const session = await auth.api.getSession({ 
      headers: headersList,
    });

    console.log('Session details:', {
      hasSession: !!session,
      sessionKeys: session ? Object.keys(session) : 'none',
      hasUser: !!session?.user,
      userKeys: session?.user ? Object.keys(session.user) : 'none',
      hasUserId: !!session?.user?.id,
      userEmail: session?.user?.email,
      sessionId: session?.session?.id,
      sessionExpires: session?.session?.expiresAt
    });

    // Check if session has user data with more lenient check
    if (!session?.user?.id) {
      console.log("No valid session found, redirecting to sign-in");
      console.log("Session object:", JSON.stringify(session, null, 2));
      redirect("/sign-in");
    }

    console.log("Valid session found, showing home page for user:", session.user.email);
    return <Homeview />;
  } catch (error) {
    console.error('Error checking session on root page:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 3) : undefined
    });
    redirect("/sign-in");
  }
}
