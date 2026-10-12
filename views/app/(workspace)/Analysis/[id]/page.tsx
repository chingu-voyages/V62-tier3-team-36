import React from 'react'
import Analysis from "../Analysis"
import { promises } from 'dns'

interface pageProps{
  params:Promise<{id:string}>
}
const page = async({params}:pageProps) => {
  const {id} = await params
  return (
    <Analysis id={id} />
  )
}

export default page
