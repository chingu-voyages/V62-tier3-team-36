"use client"
import { register } from '@/api/auth/api'
import { FormEvent, useState } from 'react'

const Register = () => {
  const [email ,setEmail] = useState("")
  const [full_name,setFullName] = useState("")
  const [organisation_name,setOrganisationName] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [isPasswordError,setPasswordError]=useState(false)
  async function handleRegister(e:FormEvent<HTMLFormElement>){
      e.preventDefault()
      if(password != confirmPassword){
        setPasswordError(true)
        return
      }
      const response = await register({email,full_name,organisation_name,password})
      if(response.status == 201){
        // do someting
      }
  }
  return (
    <div >
        <div>Logo</div>
        <div className="font-bold mt-[20px] text-[24px] text-[#202020]">Register</div>
        <div className="mt-[8px] mb-[22px] text-[#6F6F6F] text-[14px] font-light">clear supporting copy descibes the next step</div>
        <form onSubmit={handleRegister} className="space-y-[12px] w-full">
            <input onChange={(e)=>{setFullName(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type='text' name='full_name' placeholder='Full name'/>
            <input onChange={(e)=>{setOrganisationName(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type='text' name='organisation_name' placeholder='Organisation name'/>
            <input onChange={(e)=>{setEmail(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type='email' name='email' placeholder='Work email'/>
            <input onChange={(e)=>{setPassword(e.target.value)}} className="p-[13px] bg-[#FAFAFA] border-1 border-[#202020] w-full h-[46px]" type="password" name='password' placeholder='Password'/>
            <input onChange={(e)=>{setConfirmPassword(e.target.value)}}  className={`p-[13px] border-1  ${isPasswordError?"bg-[#D7D7D7] border-red-500":"bg-[#FAFAFA] border-[#202020]"} w-full h-[46px]`}  type="password" name="confirm_password" placeholder={isPasswordError?"Password miss match !":'Confirm Password'}/>
            <button className="p-[13px] border-2 border-[#202020] flex items-center justify-center bg-[#D7D7D7] font-bold text-[#202020]  cursor-pointer w-full h-[46px]" type='submit' >Continue</button>
        </form>
    </div>
  )
}

export default Register
