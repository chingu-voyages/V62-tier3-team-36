import React from 'react'
interface Children{
    children:React.ReactNode
}

const Authlayout = ({children}:Children) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-[600px]'>
        <div className='flex flex-col w-[350px] md:w-[463px]  p-[28px] dark:bg- bg-[#FFFFFF] border-2 border-[#202020] '>
            {children}
        </div>
    </div>
  )
}

export default Authlayout
