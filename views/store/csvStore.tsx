import {create} from "zustand"
interface CSVProps{
    csvfile?:File | null
    setFile:(file:File | null)=>void
    DeleteFile:()=>void
}

const csvStore = create<CSVProps>((set)=>({
    csvfile:null,
    setFile:(file)=> set({csvfile:file}),
    DeleteFile:()=> set({csvfile:null})

}))
export default csvStore 


