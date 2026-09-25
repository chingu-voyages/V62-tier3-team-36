type InputProps = {
    value:string,
    setValue:(value:string)=>void,
    type:string,
    placeholder:string,
    isLoading:boolean,
    name:string
    error:string | null
}
export  const  Input=({value,setValue,placeholder,type,isLoading,name,error=null}:InputProps)=>{
        
    return (
        <input onChange={(e)=>{setValue(e.target.value)}} value={value ||""} className={`p-[13px] border-1 border-[#202020]  ${error ? "bg-[#D7D7D7] ":"bg-[#FAFAFA] "} w-full h-[46px]`} type={type} name={name}  placeholder={placeholder}/>
    )
 }

 export default Input