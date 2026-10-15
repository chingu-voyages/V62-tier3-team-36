import Analysis from "../Analysis";

const page = async ({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params
  return <Analysis id={id}/>;
};

export default page;
