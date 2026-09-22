"use client"
import { reset_password } from '@/api/auth/api'
import React, { useState } from 'react'

const ResetPassword = () => {
  const [password,setPassword] = useState("")
  const [confirm_passowrd,setConfirmPassword]=useState("")
  async function handleSubmit(e:any){
    e.preventDefautlt()
    const response = await reset_password({password:password})
    if(response.status=200){
      // do something
    }
  }
  return (
    <div >
        <div>Logo</div>
        <div className="font-bold mt-[20px] text-[24px] text-[#202020]">Reset Password</div>
        <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">clear supporting copy descibes the next step</div>
        <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
            <input onChange={(e)=>{setPassword(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type="password" name='password' placeholder='New Password'/>
            <input onChange={(e)=>{setConfirmPassword(e.target.value)}} className="p-[13px] border-1 border-[#202020] bg-[#FAFAFA] w-full h-[46px]"  type="password" name="confirm_password" placeholder='Confirm Password'/>
            <button className="p-[13px] border-2 border-[#202020] flex items-center justify-center bg-[#D7D7D7]  cursor-pointer font-bold text-[#202020] w-full h-[46px]" type='submit' >Continue</button>
        </form>
    </div>
  )
}

export default ResetPassword
