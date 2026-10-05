import React from 'react'
import Card from './card'
import PieChart from './Charts/pieChart'
import SimpleBarChart from './Charts/BarChart'
import Link from "next/link"

const Hero = () => {
  return (
    <section  className="w-full h-full flex flex-col  mt-10">
         <div className="w-full grid lg:grid-cols-2 grid-cols-1 justify-items-center gap-5 h-full p-10">
            <div className="col-span-1 flex flex-col space-y-5 max-w-[500px]">
                <p className="md:text-7xl text-5xl font-bold w-md"><span className='text-[#202020]'>Every shelf,<br/>measured.</span><br/><span className='text-gray-400'>Every sale,<br/> decoded.</span></p>
                <p className=" text-lg font-serif text-gray-400 text-justify ">Send us your CSV. We analyze it with the pandas library and tell you the real insights hiding in your data — trends, outliers and the full analysis, in plain language.</p>
                <div className="flex justify-center space-x-3">
                    <Link href="/Register" className=" p-3 w-[200px]  bg-[#202020] font-bold text-lg rounded-xl text-white text-center hover:bg-gray-800 hover:scale-105 ">Sign up know</Link>
                    <Link href="/LogIn" className=" p-3 w-[200px]  bg-white font-bold text-lg rounded-xl  text-center  ">Upload Your CSV</Link>
                </div>
            </div>
            <div className='col-spa-1 flex-col w-full h-[450px] max-w-[500px] bg-gray-200 rounded-xl p-5'>
                <div className='bg-white h-full w-full rounded-lg p-6'>
                    <div className="grid grid-cols-3 gap-3 h-[100px]">
                        <Card title='Revenue' price='$450' percentage='+12.5%'/>
                        <Card title='Basket Size' price='$38' percentage='+9.2%'/>
                        <Card title='Stockouts' price='1.8%' percentage='-1.6%'/>
                    </div>
                    <div className="flex flex-col p-3 w-full space-y-4 rounded-xl mt-3 ">
                        <p className='text-base font-serif text-gray-500'>Monthly sales by category</p>
                        <div className="flex flex-row justify-center ">
                            <PieChart/>
                            <div className='hidden md:block'>
                                <SimpleBarChart/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </section>
  )
}

export default Hero
