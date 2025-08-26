import { headers } from "next/headers";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


const Page = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        // If user is already logged in, redirect to home
        if (session?.user?.id) {
            console.log("User already logged in, redirecting to home");
            redirect("/")
        }
    } catch (error) {
        console.log("No session found, showing sign-in page");
        // Continue to show sign-in page if there's an error getting session
    }
    
    return (
        <SignInView />
    );
}

export default Page;

