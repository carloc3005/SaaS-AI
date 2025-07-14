"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";



export const Homeview = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "Carlo" }))

  return (
    <div className="flex flex-col p-4 gap-y-4">
      {data?.greeting}
    </div>
  );
}

