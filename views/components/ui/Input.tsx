interface InputProps {
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string | null;
}

export const Input = ({
  value,
  setValue,
  isLoading = false,
  placeholder,
  type = "text",
  disabled = false,
  name,
  autoComplete,
  required = false,
  error,
}: InputProps) => {
  return (
    <div className="mb-4">
      <input
        id={name}
        onChange={(e) => setValue(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={isLoading || disabled}
        value={value}
        autoComplete={autoComplete}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
