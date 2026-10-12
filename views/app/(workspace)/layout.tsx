import Sidebar from "@/components/Sidebar";

interface AuthLayout {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: AuthLayout) => {
  return (
    <div className="flex min-h-dvh w-full flex-col md:h-dvh md:flex-row md:overflow-hidden">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col md:h-dvh md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
