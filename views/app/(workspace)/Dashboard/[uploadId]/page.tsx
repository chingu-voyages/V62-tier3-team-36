import { UploadDetailPage } from "../UploadDetailPage";

export interface UploadDetailPageProps {
  params: Promise<{ uploadId: string }>;
}

const page = ({ params }: UploadDetailPageProps) => {
  return <UploadDetailPage params={params} />;
};

export default page;
