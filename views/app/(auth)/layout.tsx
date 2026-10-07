import Sidebar from "@/components/Sidebar";

interface Children {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Children) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex min-w-0 flex-1 items-center justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-[463px] flex-col border-2 border-[#202020] bg-[#FFFFFF] p-[28px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
