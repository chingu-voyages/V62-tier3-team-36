import Changes from "../../../components/Change"
import Link from "next/link"
import React from "react"

const page = ()=>{
    return (
        
        <Changes title="Password Updated" description="Your password has been changed. Continue to login" link1="/LogIn" link2="/" button1="Back to Login"/>
    )
}
export default page