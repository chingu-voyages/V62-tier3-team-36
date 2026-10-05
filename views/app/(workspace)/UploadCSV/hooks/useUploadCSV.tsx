"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {z} from "zod"
import csvStore from  "@/store/csvStore"

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 2,621,440 bytes
const ACCEPTED_FILE_TYPES = ['text/csv', 'application/vnd.ms-excel'];



export const useUploadCSV = () => {
    const [csvFile ,setCsvFile] = useState<File | null>(null)
  const [error,setError]=useState("")
  const [isLoading ,setIsLoading]=useState(false)
  const [fileName,setFileName]=useState("")
  const [fileSize,setFileSize]=useState("")
  const [isModalOpen,setIsModalOpen]=useState(false)
  
  const CsvStore = csvStore()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = () => {
    
   const csvFileSchema = z
  .custom<File>((val)=>val instanceof File, { message: 'A CSV file is required.' })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than 2.5MB.`
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.csv'),
    'Only .csv files are accepted.'
  );

    if(!csvFile){
       setError("You are not upload any file")
    }
    const result = csvFileSchema.safeParse(
        csvFile
    )
      if(!result.success){
        setError(result.error.issues[0].message)
        setIsModalOpen(true)
        return
      }
      
        CsvStore.setFile(csvFile)
        router.push("/ValidationCSV")
    
  }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      
      if (file){
        var filesize
        if((file.size /(1024 * 1024))>= 1){
          filesize= (file.size /(1024 * 1024)).toFixed(2)
          setFileSize(`Size : ${filesize} MB`)
        }
        else{
          filesize= (file.size /1024).toFixed(2)
          setFileSize(`Size : ${filesize} KB`)
        }
        setCsvFile(file)
        setFileName(`file name : ${file.name}`)
        
      }
   

    console.log(file);
  };


  return {
    fileInputRef,
    handleChooseFile,
    handleFileChange,
    csvFile,
    setCsvFile,
    error,
    isLoading,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    isModalOpen,
    setIsModalOpen
  };
};
