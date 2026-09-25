"use client"

import { register } from "@/api/auth/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {z} from "zod"
type ErrorType = {
    email?:string
    password?:string
    full_name?:string
    confirm_password?:string
    serverError?:string
}
export function useRegister(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirm_password,setConfirmPassword]=useState("")
    const [full_name,setFullname] = useState("")
    const [error,setError] = useState<ErrorType>({})
    const [isLoading,setLoading] = useState(false)
    
    const route = useRouter()
    const RegisterSchema = z.object({
            full_name:z.string().min(3,"Name Should be min of 3 characters").max(50,"Name should be max 50 characters"),
            email:z.email("Email is not valied").trim(),
            password:z
                  .string()
                  .min(8, "Password must be at least 8 characters.")
                  .max(64, "Password must be less than 64 characters."),
            confirm_password:z.string()
        }).refine((data)=>data.password === data.confirm_password ,{
            
            message: "Passwords do not match.",
            path: ["confirm_password"]
        })
    async function handleRegister(e:any){
        e.preventDefault()
        setError({})
        
        setLoading(true)
        if(password != confirm_password){
            setError({confirm_password:"Passwords do not match."})
        }
        const result = RegisterSchema.safeParse({email:email,password:password,confirm_password:confirm_password,full_name:full_name})
        if(!result.success){
            const flattend = z.flattenError(result.error)
            setError({email:flattend.fieldErrors.email?.[0] ?? undefined
                ,password:flattend.fieldErrors.password?.[0] ?? undefined
                ,confirm_password:flattend.fieldErrors.confirm_password?.[0] ?? undefined
                ,full_name:flattend.fieldErrors.full_name?.[0] ?? undefined })   
            return 
        }


        try{
            const response = await register({email:email,password:password,full_name:full_name})
            if(response.status == 200){
                sessionStorage.setItem("token",response.token)
                route.push("/Dashboard")
                return
            }
            else if(response.status == 422){
                setError(response.error)
                 
                return
            }
        }catch(error:any){
            setError({serverError:"Some thing is wrong please try Again !"})
        }
        finally{
            setLoading(false)
        }
            
    }
    function resetTextFields(){
        useEffect(()=>{
            if(error.email ) {setEmail("")}
            if(error.password) {setPassword("")}
            if(error.confirm_password) {setConfirmPassword("")}
            if(error.full_name) {setFullname("")}
        },[error])
    }
    resetTextFields()
    return ({
        email,
        setEmail,
        password,
        setPassword,
        full_name,
        setFullname,
        isLoading,
        error,
        confirm_password,
        setConfirmPassword,
        handleRegister
    })
}