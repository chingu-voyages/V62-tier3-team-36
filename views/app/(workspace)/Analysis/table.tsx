import React from 'react'

const Table = ({columns,data}:{columns:string[],data:any[]}) => {
  return (
    <div className=" col-span-1 p-4  border-[1.6px] rounded-xl">
        <table className=" w-full gap-3">
        
            <tr className="w-full h-[40px] border-b  mt-4 " >

                {columns.map((col_name)=>{
                    return(
                        <th className="w-[33%] text-left text-lg ">{col_name}</th>
                    )
                })}
            </tr>
        
        
        { data.map((data:any)=>{
            return (
            
                <tr className="w-full h-[40px] border-b mt-4 ">
                    <td className='font-light text-gray-500'>{data[columns[0]]}</td>
                    <td className='font-light text-gray-500'>{data[columns[1]]}</td>
                    <td className='font-light text-gray-500'>{data[columns[2]]}</td>
                </tr>
           
        )
        })}
        
    </table>
    </div>
  )
}

export default Table
