interface StatusProps {
  validation_type: string;
}

const Status = ({ validation_type }: StatusProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-[#202020]">
      <span className="h-2.5 w-2.5 rounded-full bg-[#202020]" aria-hidden="true" />
      <p className="leading-6">{validation_type}</p>
    </div>
  );
};

export default Status;
