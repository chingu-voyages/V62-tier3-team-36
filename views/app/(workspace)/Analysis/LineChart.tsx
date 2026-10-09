"use client"
import React from 'react'
import {ResponsiveContainer,LineChart ,XAxis,YAxis,Tooltip,Line}from "recharts"
const Linechart = ({data,xDataKey,lDataKey}:{data:any[];xDataKey:string;lDataKey:string}) => {
  return (
    <div className="col-span-1 p-2 border-[1.6px] rounded-xl ">
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <XAxis dataKey={xDataKey} fontSize={10} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" fontSize={10} dataKey={lDataKey} stroke="#2563eb" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
      
    </div>
  )
}

export default Linechart 
