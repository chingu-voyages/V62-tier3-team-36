import React from 'react'

interface StatusProps{
    isValidationFetch:boolean,
    isValid:boolean,
    validation_type:string
}
const Status = ({isValidationFetch,isValid,validation_type}:StatusProps) => {
    
    
  return (
    <div className="flex flex-row justify-between items-center border-b">
        <div className="flex flex-row gap-3 my-[13px] ">
            {!isValidationFetch ?<div className={` ml-[10px] w-[20px] h-[20px] rounded-full bg-yellow-300 border-[1.6] border-[#202020]`}></div>:<div className={` ml-[10px] w-[20px] h-[20px] rounded-full ${isValid?"bg-green-300":"bg-red-300"} border-[1.6] border-[#202020]`}></div>}
            <p className="text-[16px] mr-[10px]">{validation_type}</p>  
        </div>
       {!isValidationFetch?<div className="mr-[10px] py-[4px] px-[8px] text-center bg-[#DEDEDE] text-[11px] text-[#202020]">checking...</div>:<div className="mr-[10px] py-[4px] px-[8px] text-center bg-[#DEDEDE] text-[11px] text-[#202020]">{isValid?"passed":"faild"}</div>}
    </div>
  )
}

export default Status
