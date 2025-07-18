import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/")
  }

  return <SignInView />;
};

export default SignInPage;
