interface ButtonProps {
  isLoading?: boolean;
  text: string;
}

export const Button = ({ isLoading = false, text }: ButtonProps) => {
  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#222222] px-4 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
      type="submit"
      disabled={isLoading}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {text}
    </button>
  );
};
