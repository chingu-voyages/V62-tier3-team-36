type ProductProps = {
  Number: string;
  title: string;
  description: string;
};

const ProductCard = ({ Number, title, description }: ProductProps) => {
  return (
    <div className="bg-white col-span-1 flex flex-col p-5 h-[220px] space-y-4 max-w-[350px] hover:scale-105 rounded-xl">
      <div className="text-white font-bold bg-[#202020] h-[50px] w-[50px] text-center p-2 ">
        {Number}
      </div>
      <p className="text-[#202020] font-bold text-lg ">{title}</p>
      <p className="text-gray-500 font-serif md:text-base text-sm">
        {description}
      </p>
    </div>
  );
};

export default ProductCard;
