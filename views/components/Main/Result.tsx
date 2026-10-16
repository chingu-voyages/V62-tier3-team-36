type cardProps = {
  rate: string;
  description: string;
};

const Result = ({ rate, description }: cardProps) => {
  return (
    <div className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-gray-700 bg-white/5 p-5 shadow-sm backdrop-blur-sm">
      <p className="text-3xl font-bold text-white sm:text-4xl">{rate}</p>
      <p className="text-sm leading-6 text-gray-400">{description}</p>
    </div>
  );
};

export default Result;
