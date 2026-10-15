"use client"
import { useEffect, useState } from "react";
import { get_insight_csv, get_upload_csv } from "@/api/analysis";

interface AnalysisType {
  aov?: number;
  generated_at?: string;
  growth?: number;
  profit_margin?: number;
  revenue_by_category?: [{ category: string; revenue: number; units: number }];
  revenue_by_region?: [{ region: string; revenue: number; units: number }];
  revenue_by_segment?: [{ segment: string; revenue: number; units: number }];
  revenue_trend?: [{ month: string; revenue: number }];
  top_customers?: [];
  top_products?: [{ product: string; revenue: number; units: number }];
  total_customers?: number;
  total_orders?: number;
  total_revenue?: number;
  total_units?: number;
}
interface InsightType {
   description:string
   type:string
   recommendation:string
   title:string
}

const useAnalysis = ({id}:{id:string}) => {
const [error, setError] = useState("");
const [data, setData] = useState<AnalysisType>({});
const [insight,setInsight] = useState<InsightType[]>([])
  useEffect(()=>{
    let isCancelled = false
    async function insightData(){
      try{
        const response = await get_insight_csv(id)
        if(!isCancelled && response.data.length > 0){
          setInsight(response.data)
          console.log(response.data)
        }
        
      }
      catch(error){
        if(!isCancelled){

          setError("some thing is wrong getting insight")
        }
      }

    }
    
    async function analysis() {
      try {
        const response = await get_upload_csv(id);
        if(!isCancelled){
            setData(response.data.analysis)
        }
        
      } catch (error: any) {
        if(!isCancelled){

          if (error.response.status == 401) {
            setError("you must login to use the app");
            console.log(error)
          } else {
            setError("Some thing is wrong please try again");
            console.log(error)
          }
          return null;
        }
      }
    }
    
    analysis()
    insightData()
    
    return ()=>{
      isCancelled = true
    }

  },[id])
  


  return {
    error,
    setError,
    data,
    setData,
    uploadId:id,
    insight
  };
};

export default useAnalysis;
