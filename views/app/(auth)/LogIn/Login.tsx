"use client"
import { login } from '@/api/auth/api'
import React, { useState } from 'react'

const Login = () => {
  const [iserror,setError]=useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword]= useState("")
  async function handleLogin(e:any){
    e.preventDefault()
    if(email == "" || password ==""){
      setError(true)
      return true
    }
    const response = await login({email:email,password:password})
    if(response.status==200){
      // do some think
    }
  }
  return (
    <div >
        <div>Logo</div>
        <div className="font-bold mt-[20px] text-[24px] text-[#202020]">Login</div>
        <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">clear supporting copy descibes the next step</div>
        <form onSubmit={handleLogin} className="space-y-[12px] w-full">
            {iserror?<div className="p-[13px] border-2 border-[#202020] cursor-pointer hover:bg-gray-400  bg-[#D7D7D7] font-bold text-[#202020] w-full text-sm h-[46px]">Email or password is incorrect, Try again</div>:null}
            <input onChange={(e)=>{setEmail(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type='email' name='email' placeholder='Work email'/>
            <input onChange={(e)=>{setPassword(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type="password" name='password' placeholder='Password'/>
            <button className="p-[13px] border-2 border-[#202020] cursor-pointer hover:bg-gray-400 flex items-center justify-center bg-[#D7D7D7] font-bold text-[#202020] w-full h-[46px]" type='submit' >Continue</button>

        </form>
    </div>
  )
}

export default Login
