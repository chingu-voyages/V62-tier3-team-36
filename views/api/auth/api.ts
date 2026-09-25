import axios from "axios"

interface Register{
    full_name:string
    password:string
    email:string
}
interface Login{
    email:string
    password:string
}
interface ResetPass{
    password:string
}
interface ForgotPassword{
    email:string
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL

export const register = async({full_name,email,password}:Register)=>{
    try{
        const response = await axios.post(url+"/api/register",{full_name,email,password},{headers:{"Accept":"application/json"},withCredentials:true})
        if(response.data){
            return response.data
        }
    }catch(error:any){
        console.log("error",error)
    }
}
export const login = async({email,password}:Login)=>{
    try{
        const response = await axios.post(url+"/api/login",{email,password},{headers:{"Accept":"application/json"},withCredentials:true})
        if(response.data){
            return response.data
        }
    }catch(error:any){
        console.log("error",error)
    }

}
export const forgot_password = async({email}:ForgotPassword)=>{
    try{
        const response = await axios.post(url+"/api/forgot_password",{email},{headers:{"Accept":"application/json"},withCredentials:true})
        if(response.data){
            return response.data
        }
    }catch(error:any){
        console.log("error",error)
    }

}
export const reset_password = async({password}:ResetPass)=>{
    try{
        const response = await axios.post(url+"/api/reset_password",{password},{headers:{"Accept":"application/json"},withCredentials:true})
        if(response.data){
            return response.data
        }
    }catch(error:any){
        console.log("error",error)
    }
}

