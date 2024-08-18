"use client";

import { useBasket } from "@/services/basket-service";
import Link from "next/link";

const Basket = () => {
    const { data: basket } = useBasket();

    return (
        <div>
            <Link href="/cart" className="underline">
                Sepete git: {basket?.basketItems?.length || 0}
            </Link>
        </div>
    );
};

export default Basket;
