type InputProps = {
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
};

export const Input = ({
  value,
  setValue,
  isLoading,
  placeholder,
  type = "text",
  disabled,
}: InputProps) => {
  return (
    <input
      onChange={(e) => {
        setValue(e.target.value);
      }}
      className={`p-[13px] text-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]`}
      type={type}
      name={value}
      placeholder={placeholder}
      disabled={isLoading || disabled}
      value={value}
    />
  );
};
