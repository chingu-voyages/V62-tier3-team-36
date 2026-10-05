type ButtonProps = {
  isLoading?: boolean;
  text: string;
};

export const Button = ({ isLoading, text }: ButtonProps) => {
  return (
    <button
      className={`p-[13px] border-2 border-[#202020] cursor-pointer flex items-center justify-center ${
        isLoading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-[#D7D7D7] hover:bg-gray-400 text-[#202020]"
      } font-bold text-[#202020] w-full h-[38px] transition-colors`}
      type="submit"
      disabled={isLoading}
    >
      {text}
    </button>
  );
};
