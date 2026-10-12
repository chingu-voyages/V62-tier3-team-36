import React from 'react'

interface StatusProps{

    validation_type:string
}
const Status = ({validation_type}:StatusProps) => {
      
  return (
    <div className="flex flex-row justify-between items-center border-b">
        <div className="flex flex-row gap-3 my-[13px] ">
            <div className={` ml-[10px] w-[20px] h-[20px] rounded-full bg-gray-300 border-[1.6] border-[#202020]`}></div>
            <p className="text-sm mr-[10px]">{validation_type}</p>  
        </div>
    </div>
  )
}

export default Status
