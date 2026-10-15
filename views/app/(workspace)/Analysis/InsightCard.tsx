import React from 'react'

interface InsightProps{
    type:string
    title:string
    description:string
    recommandetion:string
}
const InsightCard = ({type,title,description,recommandetion}:InsightProps) => {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md `}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight text-[#202020]">
          {title}
        </h3>

        
      </div>
      <p className="text-sm pl-3 md:w-2xl leading-5 text-gray-400">{description}</p>
      
      <div className="flex flex-col p-3 mt-3 rounded-xl border-gray-200 ">
        <h3 className="text-base  font-semibold tracking-tight text-[#202020]">
          recommandetion
        </h3> 
        <p className="md:w-2xl pl-3 pt-3 text-sm leading-5 text-gray-400">{recommandetion}</p>
      </div>
      
    </section>
  )
}

export default InsightCard
