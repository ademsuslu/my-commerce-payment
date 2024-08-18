'use client';

import { createOrUpdateBasketItem, getBasket } from '@/actions/actions';
import { BasketItem } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Sepet verilerini getiren hook
export const useBasket = () => {
    return useQuery({
        queryKey: ['basketItems'],
        queryFn: async () => {
            const data = await getBasket();
            return data[0] || null;
        },
        initialData: null,
    });
};

// Ürün eklemek için kullanılan hook
interface CreateProductAction {
    productId: string;
    quantity: number;
    token: string;
    price: number;
}

export const useAddToBasket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity, token, price }: CreateProductAction) => {
            const item = {
                productId, quantity, token, price
            };
            const result = await createOrUpdateBasketItem(item);
            //@ts-ignore
            if (result?.message) {
                //@ts-ignore
                throw new Error(result.message);
            }

            return result;
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ['basketItems'] });

            const previousBasket = queryClient.getQueryData(['basketItems']);

            queryClient.setQueryData(['basketItems'], (oldBasket: any) => {
                if (!oldBasket) return oldBasket;

                const updatedBasketItems = [...oldBasket.basketItems, {
                    ...newItem,
                    id: Math.random().toString(36).substring(7), // Temporary ID
                    Products: oldBasket.basketItems[0]?.Products,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }];

                return {
                    ...oldBasket,
                    basketItems: updatedBasketItems,
                    totalPrice: oldBasket.totalPrice + newItem.price,
                };
            });

            return { previousBasket };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(['basketItems'], context?.previousBasket);

            alert(err instanceof Error ? err.message : 'Sepete eklenirken bir hata oluştu');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['basketItems'] });
        },
    });
};
