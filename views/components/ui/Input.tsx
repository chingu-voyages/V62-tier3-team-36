type InputProps = {
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  autoComplete?: string;
  required?: boolean;
};

export const Input = ({
  value,
  setValue,
  isLoading,
  placeholder,
  type = "text",
  disabled,
  name,
  autoComplete,
  required,
}: InputProps) => {
  return (
    <input
      onChange={(e) => {
        setValue(e.target.value);
      }}
      className={`p-[13px] text-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]`}
      type={type}
      name={name}
      placeholder={placeholder}
      disabled={isLoading || disabled}
      value={value}
      autoComplete={autoComplete}
      required={required}
    />
  );
};
