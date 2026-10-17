import Analysis from "../Analysis";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: AnalysisPageProps) => {
  const { id } = await params;
  return <Analysis uploadId={id} />;
};

export default page;
