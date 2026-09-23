import Link from 'next/link'
import React from 'react'
interface ChangeInteface{
    title:string
    description:string
    link1:string
    link2:string
    button1:string
}

const Changes = ({title,description,link1,link2 ,button1}:ChangeInteface) => {
  return (
    <div className="flex flex-col justify-center items-center">
        <div className="w-[74px] h-[74px] rounded-full border-2 bg-[#DEDEDE] border-[#202020]"></div>
            <p className="font-bold mt-[20px] text-[24px] text-[#202020]">{title}</p>
            <p className="font-light mt-[10px] text-[14px] text-[#6F6F6F]">{description}</p>
            <div className="flex mt-[22px] flex-row space-x-[10px]">
            <Link className="font-bold px-[14px] py-[9px] border-2 bg-[#D7D7D7] border-[#202020] text-[#202020]" href={link1}>{button1}</Link>
            <Link className="font-bold px-[14px] py-[9px] border-2 bg-[#FFFFFF] border-[#202020] text-[#202020]" href={link2}>back</Link>
        </div>
    </div>
  )
}

export default Changes
