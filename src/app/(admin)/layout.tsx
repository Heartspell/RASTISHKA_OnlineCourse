import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
