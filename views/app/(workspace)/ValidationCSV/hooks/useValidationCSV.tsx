"use client"
import React, { useEffect, useState } from 'react'
import csvStore from "@/store/csvStore"

const test_data = {
    required_Columns:true,
    data_type:true,
    data_format:true,
    unique_row:true,
    currency_value:true
  }
interface ValidationResultProps{
  required_Columns?:boolean,
    data_type?:boolean,
    data_format?:boolean,
    unique_row?:boolean,
    currency_value?:boolean
}
const useValidationCSV = () => {
   const CsvStore = csvStore()
   const [fileName,setFileName]=useState("")
   const [isValidationFetch,setIsValidationFetch]=useState(false)
   const [validationResult ,setValidationResult]=useState<ValidationResultProps>({})
   useEffect(()=>{
     if(CsvStore.csvfile){
      setFileName(CsvStore.csvfile.name)
      
      setTimeout(()=>{
        setIsValidationFetch(true)
         setValidationResult(test_data)
      },8000)
     
     }
   },[])
  
  return (
    {
      fileName,
      validationResult,
      isValidationFetch
    }
  )
}

export default useValidationCSV
