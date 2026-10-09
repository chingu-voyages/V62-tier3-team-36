import AnalysisStore from '@/store/analysisStore'
import React, { useEffect, useState } from 'react'
import {analysisData} from "@/api/analysis"

interface AnalysisType{
    aov?:number
    generated_at?:string
    growth?:number
    profit_margin?:number
    revenue_by_category?:[{category:string,revenue:number,units:number}]
    revenue_by_region?:[{region:string,revenue:number,units:number}]
    revenue_by_segment?:[{segment:string,revenue:number,units:number}]
    revenue_trend?:[{month:string,revenue:number}]
    top_customers?:[]
    top_products?:[{product:string,revenue:number,units:number}]
    total_custumers?:number
    total_orders?:number
    total_revenue?:number
    total_units?:number
}
const useAnalysis = () => {
  const analysisStore = AnalysisStore()
  const [error,setError] = useState("")
  const [data,setData] = useState<AnalysisType>({})
  async function analysis({id}:{id:string}){
     try{
        const response = await analysisData({id:id})
        return response.data
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
  return ({
    error,
    setError,
    analysis,
    data,
    setData
  })
  
}

export default useAnalysis
