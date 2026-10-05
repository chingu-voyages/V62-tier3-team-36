import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='pl-20 p-15 border-t border-gray-500 grid grid-cols-2 md:grid-cols-4 gap-6'>
        <div className='flex flex-col'>
            <div className='font-bold'>Logo</div>
            <p className='text-sm text-gray-500'>Retail analytics for operators who'd rather know than guess.</p>
        </div>
        <div className='flex flex-col spacey-5'>
            <p className='font-bold text-[#202020] md:text-base text-sm'>Product</p>
            <Link href={"#feature"} className='text-gray-500 md:text-base text-sm'>Feature</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Integrations</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Changelog</Link>
        </div>
        <div className='flex flex-col spacey-5'>
            <p className='font-bold text-[#202020] md:text-base text-sm'>Company</p>
            <Link href="#" className='text-gray-500 md:text-base text-sm'>About</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Blogs</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Contact</Link>
        </div>
        <div className='flex flex-col spacey-5'>
            <p className='font-bold text-[#202020] md:text-base text-sm'>Legal</p>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Privacy</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Terms</Link>
            <Link href={"#"} className='text-gray-500 md:text-base text-sm'>Security</Link>
        </div>
    </div>
  )
}

export default Footer
