import React from 'react'
type CardProps={
    title:string
    price:string
    percentage:string
}
const Card = ({title,price,percentage}:CardProps) => {
  return (
    <div className='col-span-1 flex flex-col p-4 h-full bg-[#F7F7F7] shadow-xl rounded-xl '>
        <p className='text-gray-500 md:text-sm text-[12px] font-light'>{title}</p>
        <p className="text-[#202020] font-bold md:text-lg text-base">{price}</p>
        <p className="text-[#202020] font-semibold text-[12px]">{percentage}</p>
    </div>
  )
}

export default Card
