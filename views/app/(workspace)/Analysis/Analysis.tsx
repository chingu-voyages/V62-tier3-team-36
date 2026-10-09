import React, { useEffect } from 'react'
import KPICard from './KPICard'
import Barchar from "./Barchart"
import Piechart from './Piechart'
import  Linechart  from './LineChart'
import Table from './table'
import useAnalysis from './hooks/useAnalysis'
import {analysisData} from "@/api/analysis"

const Analysis = ({id}:{id:string}) => {
  const {data,setData,error,setError} = useAnalysis()
  useEffect(()=>{
    
      async function analysis(){
         try{
            const response = await analysisData({id:id})
            setData(response.data.analysis)
         }
         catch(error:any){
            if(error.response.status== 401){
              setError("you must login to use the app")
            }
            else{
              setError("Some thing is wrong please try again")
            }
            return null
         }
      }
      analysis()
  },[id])
  return (
    <div className="flex flex-col w-full p-[20px] border-[1.6px]">
        <div className='flex flex-row justify-between '>
            <div className="flex flex-col ">
                <p className='text-lg font-bold'>Your Data Analysis</p>
                <p className="text-sm  font-light text-[var(--medium-gray)]">Retail Lense you data analyser</p>
            </div>
            <div className='text-center items-center text-[14px] h-[40px] border-[1.6px] text-[#202020] border-[#202020] bg-[#D7D7D7] px-[14px] py-[9px] '>Filters</div>
        </div> 
        <div className='mt-[8px] grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-3 max-w-[1000px] '>
            <KPICard name='Tevenue' analysis='$284k'/>
            <KPICard name='AOV' analysis='$40'/>
            <KPICard name="Total Order" analysis='40'/>
            <KPICard name='Profit Margin' analysis='20%'/>
            <KPICard name="Growth" analysis="-5%"/>
        </div>
        <div className="grid mt-[10px] md:grid-cols-2  gap-3 grid-col-1">
            <Barchar data= {[{category: 'Office', revenue: 240, units: 2},{category: 'Lighting', revenue: 90, units: 3},{category: 'Electronics', revenue: 500, units: 2},{category: 'cloths', revenue: 330, units: 4}] } layout="vertical" dataKey="category" barDataKey="revenue"  />
            <Piechart data={[{product: 'Desk', revenue: 240, units: 2},{product: 'Lamp', revenue: 90, units: 3},{product: 'shouse', revenue: 50, units: 2},{product: 'tishert', revenue: 60, units: 3}]} dataKey='revenue' nameKey={"product"} />
            <Barchar data= {[{category: 'Office', revenue: 240, units: 2},{category: 'Lighting', revenue: 90, units: 3},{category: 'Electronics', revenue: 500, units: 2},{category: 'cloths', revenue: 330, units: 4}] } layout="horizontal" dataKey="category" barDataKey="revenue"  />
            <Linechart data={[{month: '2026-03', revenue: 130},{month: '2026-04', revenue: 220},{month: '2026-05', revenue: 180},{month: '2026-07', revenue: 55},{month: '2026-08', revenue: 120}]}  xDataKey={"month"} lDataKey="revenue"/>
            <Table columns={["product","revenue","units"]} data={[{product: 'Desk', revenue: 240, units: 2},{product: 'Lamp', revenue: 90, units: 3},{product: 'shouse', revenue: 50, units: 2},{product: 'tishert', revenue: 60, units: 3}]} />
        </div>

    </div>
  )
}

export default Analysis
