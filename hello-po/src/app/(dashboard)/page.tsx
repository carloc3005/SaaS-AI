import { Homeview } from "@/modules/home/ui/view/home-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// http://localhost:3000

const Page = async () => {
  const greeting = await caller.hello({ text: "Carlo's Server"})

  const session = await auth.api.getSession({ 
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Homeview />
  );
}

export default Page;