type ProductProps = {
  Number: string;
  title: string;
  description: string;
};

const ProductCard = ({ Number, title, description }: ProductProps) => {
  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#202020] text-sm font-bold text-white">
        {Number}
      </div>

      <p className="mt-5 text-lg font-semibold text-[#202020]">{title}</p>

      <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default ProductCard;
