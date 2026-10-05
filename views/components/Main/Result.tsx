import React from 'react'
type cardProps={
    rate:string,
    description:string
}

const Result = ({rate,description}:cardProps) => {
  return (
    <div className="flex flex-col border-1 col-span-1 space-y-3 p-3 max-h-[150px] border-gray-400 rounded-xl">
      <p className="md:text-4xl text-3xl font-bold text-white ">{rate}</p>
      <p className="text-sm   text-gray-500">{description}</p>
    </div>
  )
}

export default Result 
