import { Homeview } from "@/modules/home/ui/view/home-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  const session = await auth.api.getSession({ 
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <Homeview />;
}
