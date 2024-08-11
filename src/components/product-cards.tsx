"use client"
import { createOrUpdateBasketItem } from '@/actions/actions';
import { Products } from '@prisma/client'
import React, { FC } from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
interface CreateProductAction {
    productId: string;
    quantity: number;
    token: string;
    price: number;
  }

  
const ProductCards:FC<Products[] | any> = ({product}) => {
const router = useRouter()

    const handleClick = async ({ productId, quantity, token, price }: CreateProductAction) => {
        const res = await createOrUpdateBasketItem({ productId, quantity, token, price });
        console.log("handleClick res")
        console.log(res)
        router.refresh()
    };

    return (
        <div>
            <div key={product.id} className="border flex flex-col justify-between items-center hover:shadow-md">
                <div className="w-full h-32 object-contain">
                    <img src={product?.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="my-5 flex flex-col space-y-2 px-2">
                    <h1>{product.title}</h1>
                    <p>{product.description}</p>
                    <b className="bg-green-500 p-1 text-white rounded ">{product.price} TL</b>
                </div>
                <Button

                    onClick={()=>handleClick({ productId: product.id, quantity: 1, token: "4sa45a", price: product.price })}

                    className="mt-5"
                    variant={"outline"}
                >
                    Add to basket
                </Button>
            </div>
        </div>
    )
}

export default ProductCards