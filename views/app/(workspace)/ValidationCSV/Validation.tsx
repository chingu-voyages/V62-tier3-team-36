"use client";
import React from "react";
import Link from "next/link";
import csvStore from "@/store/csvStore";
import useValidationCSV from "./hooks/useValidationCSV";
import Status from "./State";

const Validation = () => {
  const { error,fileName, validationResult, isValidationFetch } = useValidationCSV();
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col w-full p-[20px] border-[1.6px]">
        <div className="flex flex-row justify-between items-center ">
          <div className="flex flex-col ">
            <p className="text-lg font-bold ">Validating retail dataset </p>
            <p className="text-sm font-light text-[var(--medium-gray)]">
              {" "}
              {fileName ? fileName : "Coulden't find file name"}
            </p>
          </div>
          <Link
            href="/Dashboard"
            className="text-center min-w-[98px]  bg-[#D7D7D7] font-bold text-[14px] py-[9px] "
          >
            Continue
          </Link>
        </div>
        <div className="mt-[18px] bg-[#E0E0E0] text-[#202020] border-[0.8px] text-[12px] p-[10px]">
          Validation protects analytics quality before processing begins.
        </div>

        <div className="mt-[18px] w-full flex flex-col border-[1.6px] border-[#202020]">
          {error ?
          <>
          {error?.error?
          <Status
           
            validation_type={error?.error}
          />
          :null
          }
          {Array.isArray(error?.row_errors) && error?.row_errors.map((errors:any) => {
          return (
          <Status
           
            validation_type={`${errors.error} in row ${errors.row}`}
          />)
          })}
          {error.invalid_rows ?
          <Status
            validation_type={`invalid rows ${error?.invalid_rows}`}
          />
          :null
          }
          { error.valid_rows?
          <Status
            validation_type={`valid rows ${error.valid_rows}`}
          />:null
          }

          </>
         :
         null
        }
        </div>
      </div>
    </div>
  );
};

export default Validation;
