import { ResetPassword } from "./ResetPassword";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : (params.token ?? "");

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
