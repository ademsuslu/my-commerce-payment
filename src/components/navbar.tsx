import { getBasket } from "@/actions/actions"
import  Link  from "next/link"

const Navbar = async() => {
  const basket = await getBasket()
  return (
    <div className="container mx-auto flex items-center justify-between h-12 ">
      <Link href="/" className="underline">Home</Link>
    <span>
      <Link href="/cart" className="underline">Sepete git: {basket[0].basketItems.length}</Link>
    </span>
    </div>
  )
}

export default Navbar