import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { verifyToken, COOKIE_NAME } from "@/lib/auth/server";

function toDisplayName(email: string): string {
  const prefix = email.split("@")[0];
  return prefix
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;
  const userName = session?.email ? toDisplayName(session.email) : "User";

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-login-button-hover">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-slate-50 rounded-tl-4xl">
          <Header userName={userName} />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:py-8 lg:px-20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
