"use client";
import { useEffect, useState } from "react";
import csvStore from "@/store/csvStore";
import { upload_csv } from "@/api/analysis";

interface ValidationResultProps {
  required_Columns?: boolean;
  data_type?: boolean;
  data_format?: boolean;
  unique_row?: boolean;
  currency_value?: boolean;
}
interface ErrorProps {
  error?: string;
  valid_rows?: string;
  invalid_rows?: string;
  row_errors?: [
    {
      error: string;
      row: string;
    },
  ];
}
const useValidationCSV = () => {
  const CsvStore = csvStore();
  const [fileName, setFileName] = useState("");
  const [isValidationFetch, setIsValidationFetch] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResultProps>({});
  const [error, setError] = useState<ErrorProps>({});
  const [isValid, setIsValid] = useState(false);
  const [upload_id, setUploadId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  async function upload(csvFile: File) {
    try {
      const formData = new FormData();

      formData.append("file", csvFile);

      const response = await upload_csv(formData);
      if (response.status == 201) {
        console.log(response.data);
        if (response.data.invalid_rows > 0) {
          const data = response.data;
          setError({
            row_errors: data.row_errors,
            invalid_rows: data.invalid_rows,
            valid_rows: data.valid_rows,
          });

          setIsValid(true);
          setIsLoading(false);
          setUploadId(response.data.upload_id);
        } else {
          setError({
            error: "all rows and columns are passed and you can continue",
          });

          setIsValid(true);
          setIsLoading(false);
          setUploadId(response.data.upload_id);
        }
      }
    } catch (error: any) {
      if (error.response.status == 422) {
        console.log(error.response.data);
        setError(error.response.data);
        setIsLoading(false);
      }
    }
  }
  useEffect(() => {
    if (CsvStore.csvfile) {
      setFileName(CsvStore.csvfile.name);
      upload(CsvStore.csvfile);
      // setTimeout(()=>{
      //   setIsValidationFetch(true)
      //    setValidationResult(test_data)
      // },8000)
    }
  }, []);

  return {
    isLoading,
    upload_id,
    fileName,
    validationResult,
    isValidationFetch,
    error,
    isValid,
  };
};

export default useValidationCSV;
