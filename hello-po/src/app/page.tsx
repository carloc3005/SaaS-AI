import { SimpleHomeView } from "@/components/simple-home";

export default async function RootPage() {
  console.log("Root page server component loaded - MINIMAL VERSION");
  
  return <SimpleHomeView />;
}
