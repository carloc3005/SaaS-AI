import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col h-screen w-screen">
          <DashboardNavbar/>
          {children}
        </main>
      </SidebarProvider>
    </NuqsAdapter>
  );
}

export default Layout;