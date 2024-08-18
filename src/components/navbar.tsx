
import Link from "next/link"
import Basket from "./basket"

const Navbar = async () => {

  return (
    <div className="container mx-auto flex items-center justify-between h-12 ">
      <Link href="/" className="underline">Home</Link>
      <span>
        <Basket />
      </span>
    </div>
  )
}

export default Navbar