"use client"
import { register } from '@/api/auth/api'
import React, {  useState } from 'react'
import { useRegister } from './hooks/useRegister'
import {Input} from "../../../components/ui/RegisterInput"
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
interface Error{
    full_name?:string
    email?:string,
    password?:string
    confirm_password?:string
}
  

const Register = () => {
  
  const {handleRegister,email ,setEmail,password,setPassword,full_name,setFullname,isLoading,error,setConfirmPassword ,confirm_password}=useRegister()  
 
  return (
    <div >
        <div>Logo</div>
        <div className="font-bold mt-[20px] text-[24px] text-[#202020]">Register</div>
        <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">clear supporting copy descibes the next step</div>
        <form onSubmit={handleRegister} className="space-y-[12px] w-full">
            {/* <input onChange={(e)=>{setFullName(e.target.value)}} className={`p-[13px] border-1  ${errors.full_name ?"bg-[#D7D7D7] border-red-500":"bg-[#FAFAFA] border-[#202020]"} w-full h-[46px]`} type='text' name='full_name' placeholder={errors.full_name?errors.full_name:'Full name'}/> */}
            <Input name='full_name' type='text' value={full_name} setValue={setFullname} placeholder={error.full_name ?error.full_name:'Your Full Name' } error={error.full_name?error.full_name:null} isLoading={isLoading}/>
            <Input name='email' type='email' value={email} setValue={setEmail} placeholder={error.email ?error.email:'Work email' } error={error.email?error.email:null} isLoading={isLoading}/>
            <Input name='password' type='password' value={password} setValue={setPassword} placeholder={error.password ?error.password:'Password' } error={error.password?error.password:null} isLoading={isLoading}/>
            <Input name='confirm_password' type='password' value={confirm_password} setValue={setConfirmPassword} placeholder={error.confirm_password ?error.confirm_password:'Confirm Password' }error={error.confirm_password?error.confirm_password:null} isLoading={isLoading}/>
            <Button isLoading={isLoading} text="Continue" />    
        </form>

    </div>
  )
}

export default Register
