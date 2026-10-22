import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

interface AuthLayout {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: AuthLayout) => {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh w-full flex-col bg-gray-50 lg:h-dvh lg:flex-row lg:overflow-hidden">
        <Sidebar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-gray-50 lg:h-dvh lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

export default WorkspaceLayout;
