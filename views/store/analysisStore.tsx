import {create} from "zustand"

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
interface AnalysisStoreType{
    analysis:AnalysisType | {}
    setAnalysis:(value:AnalysisType)=>void
}
 const AnalysisStore = create<AnalysisStoreType>((set)=>({
    analysis:{},
    setAnalysis:(value)=>set({analysis:value})
 }))

 export default AnalysisStore