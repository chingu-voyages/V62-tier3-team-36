import Link from "next/link"
import React from "react"
 const Navbar = ()=>{
    return (
        <div className="flex flex-row justify-between items-center sticky w-full h-[50px] bg-[#EDEDED]/85 p-4">
            <div className="font-bold text-lg ">Logo</div>
            <div className="flex flex-row gap-2">
                <p className="text-gray-600 font-light text-base hover:text-black">feature</p>     
                <p className="text-gray-600 font-light text-base hover:text-black">About</p>
            </div>
            <div className="flex flex-row gap-2">
                <Link href="/LogIn" className="flex justify-center h-[30px] px-5 text-center font-bold  text-[#202020] bg-white text-black items-center cursor-pointer hover:bg-gray-300">Log In</Link>
                <Link href="/Register" className="flex justify-center font-bold  text-[#202020] h-[30px] px-5 text-center bg-[#D7D7D7] text-black items-center cursor-pointer text-bold hover:bg-gray-300">Sign up</Link>
            </div>

        </div>
    )
}
export default Navbar


