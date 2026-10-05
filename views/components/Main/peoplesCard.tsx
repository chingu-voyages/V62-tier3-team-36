import React from 'react'

type CommentPops={
    isblack:boolean
    comment:string
    full_name:string
    start_name:string
}

const CommentCard = ({isblack,comment,full_name,start_name}:CommentPops) => {
  
  return (
    <div className={`flex max-w-[350px] flex-col col-span-1 ${isblack?"bg-[#202020]":"bg-white"} space-y-5 rounded-xl p-5 hover:scale-105 hover:shadow-xl`}>
      <p className={`${isblack?"text-white":"text-[#202020]"} text-base`}>{`" ${comment} "`}</p>
      <div className="flex flex-row items-center  space-x-3">
        <div className={`w-[40px] flex h-[40px] rounded-full ${isblack ? "text-[#202020] bg-white":"text-white  bg-[#202020]"} items-center justify-center font-bold`}>{start_name}</div>
        <p className={`${isblack ? "text-white":"text-[#202020]"} text-sm font-bold`}>{full_name}</p>
      </div>
    </div>
  )
}

export default CommentCard
