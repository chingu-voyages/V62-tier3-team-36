import Sidebar from '../../components/Sidebar'
import React from 'react'
interface AuthLayout{
    children:React.ReactNode
}

const WorkspaceLayout = ({children}:AuthLayout) => {
  return (
    <div className="flex flex-row ">
      <Sidebar/>
      <div className="bg-[#FFFFFF] w-[551px] h-[554px]">
         <div className="w-full h-[14px] flex flex-row justify-between items-center px-[16px] border-b border-1 border-[#B9B9B9] h-[54px] ">
            <p className='text-[#6F6F6F] text-[14px] font-light'>description</p>
            <div className='w-[28px] h-[28px] rounded-full border-1 border-[#202020] bg-[#D4D4D4]'></div>
         </div>
         {children}
      </div>
     
    </div>
  )
}

export default WorkspaceLayout
