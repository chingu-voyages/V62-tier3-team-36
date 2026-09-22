import Changes from "../../../components/Change"
import Link from "next/link"
import React from "react"

const page = ()=>{
    return (
        <Changes title="Session Expired" description="For security, please sign in again" link1="/LogIn" link2="/" button1="Sign in"/>
    )
}
export default page