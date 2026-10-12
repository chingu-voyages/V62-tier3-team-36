"use client"
import React from 'react'
import {ResponsiveContainer ,BarChart,Bar,XAxis ,YAxis,Tooltip} from "recharts"
interface BarchartProps{
    data:any[],
    layout:string
    dataKey:string
    barDataKey:string
}

const Barchart = ({data,layout,dataKey,barDataKey}:BarchartProps) => {
  return (
   
    <div className="col-span-1 p-2 border-[1.6px] rounded-xl ">
        <ResponsiveContainer width="100%" height={300}>
        
        <BarChart data={data} layout={layout=="vertical"?"vertical":"horizontal"} >
             {layout == "vertical"?
              <>
                <XAxis type="number" />
                <YAxis dataKey={dataKey} type="category" fontSize={10} />
              </>
            :
            <>
                <XAxis dataKey={dataKey} type="category" fontSize={10}  />
                <YAxis type="number"/>
              </>
             }
            <Tooltip />
            <Bar dataKey={barDataKey} fill="#4f46e5" maxBarSize={32}/>
        </BarChart>
        </ResponsiveContainer>
    </div>
    
  )
}

export default Barchart
