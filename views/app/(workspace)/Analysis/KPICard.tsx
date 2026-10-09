import React from 'react'

type KPICardProps={
    name:string
    analysis:string
}
const KPICard = ({name,analysis}:KPICardProps) => {
  return (
    <div className="flex flex-col col-span-1 max-h-[100px] rounded-xl max-w-[200px] border-[1.6px] p-4">
        <p className="text-[14px] ">{name}</p> 
        <p className="text-3xl font-bold text-[#202020]">{analysis}</p>       
    </div>
  )
}

export default KPICard
