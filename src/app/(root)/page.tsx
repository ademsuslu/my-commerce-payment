import {  handleGetAllProducts } from "@/actions/actions";
import ProductCards from "@/components/product-cards";



export default async function Home() {
  const products = await handleGetAllProducts()
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 container mx-auto">
      {products.map((product,index) => (
       <ProductCards product={product} key={index}/>
      ))}
    </div>
  );
}
  
