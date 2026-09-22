"use client"
import React, { useState } from 'react'
import { forgot_password } from '../../../api/auth/api'
const ForgetPassword = () => {
  const [email,setEmail] = useState("")
  const [iserror ,setError] = useState(false)
  async function handleSubmit(e:any){
    
    if(email == ""){
      setError(true)
      return
    }
    const response = await forgot_password({email:email})
    if(response.status == 200){
      // do something
    }
  }
  return (
    <div>
        <div>Logo</div>
        <div className="font-bold mt-[20px] text-[24px] text-[#202020]">Forgot Password</div>
        <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">clear supporting copy descibes the next step</div>
        <form onSubmit={handleSubmit} className="space-y-[12px] w-full">
            <input onChange={(e)=>{setEmail(e.target.value)}} className={`p-[13px] ${iserror?"bg-[#D7D7D7]":"bg-[#FAFAFA]"} border-1 border-[#202020] w-full h-[46px]`}  type='email' name='email' placeholder={iserror?"Invalid Email":'Work email'}/>
            <button className="p-[13px] border-2 border-[#202020] cursor-pointer hover:bg-gray-400 flex items-center justify-center bg-[#D7D7D7] font-bold text-[#202020] w-full h-[46px]" type='submit' >Continue</button>
        </form>
    </div>
  )
}

export default ForgetPassword
