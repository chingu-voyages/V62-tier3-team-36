import Sidebar from "@/components/Sidebar";

interface Children {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Children) => {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-gray-50 lg:h-dvh lg:flex-row lg:overflow-hidden">
      <Sidebar />

      <main className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-x-hidden bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:h-dvh lg:overflow-y-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-gray-100 to-transparent"
        />
        <div className="relative flex w-full max-w-[463px] flex-col items-center">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
