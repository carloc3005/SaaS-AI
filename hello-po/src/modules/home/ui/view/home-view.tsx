"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Homeview = () => {
  const {data: session, isPending} = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <p>Loading...</p>
    );
  }

  if (!session) {
    return (
      <p>Redirecting...</p>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <h1 className="text-2xl font-bold">Welcome back!</h1>
      <p>Hello, {session.user.name || session.user.email}!</p>
      <Button onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } })}>
        Sign Out 
      </Button>
    </div>
  );
}

