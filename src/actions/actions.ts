"use server"

import db from "@/lib/db"

export const handleGetAllProducts = async () => {
    try {
        const products = await db.products.findMany();
        return products
    } catch (error) {
        throw new Error("get product hatalı")
    }
}
export const handleCreateProducts = async () => {
    try {
        const products = await db.products.create({
            data: {

                title: 'Bluetooth Speaker',
                price: 1200,
                category: 'Accessories',
                description: 'Portable Bluetooth speaker with deep bass and clear sound.',
                image: 'https://plus.unsplash.com/premium_photo-1677159499898-b061fb5bd2d7?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
        });
        return products
    } catch (error) {
        throw new Error("get product hatalı")
    }
}

/*!-  basket  -!*/

const SHIPPING_COST = 43.90; // Kargo ücreti default olarak eklendı ılerıde dynamıc gelıcek
interface ProductProps {
    productId?: string
    quantity: number
    price?: number
    token: string
}

// calculatePrice sadece ürünün birim fiyatını hesaplar
const calculatePrice = (price: number, optionPrice: number = 0) => {
    return price + (optionPrice ? optionPrice : 0);
};

// Sepetteki tüm ürünlerin toplam fiyatını hesaplar
const calculateTotalPrice = async (basketId: string) => {
    const basketItems = await db.basketItem.findMany({
        where: { basketId: basketId }
    });

    const totalPrice = basketItems.reduce((total, item) => total + item.price, 0);
    return totalPrice + SHIPPING_COST;
};

export const createOrUpdateBasketItem = async ({ productId, quantity, token, price }: ProductProps) => {
    let basket = await db.basket.findFirst({
        where: { token: token },
        include: { basketItems: true },
    });

    if (!basket) {
        basket = await db.basket.create({
            data: {
                token: token,
                totalPrice: 0, // İlk başta totalPrice 0 olarak başlatılıyor
                basketItems: {
                    create: {
                        productId: String(productId),
                        quantity: quantity as number,
                        price: calculatePrice(Number(price)) * quantity // Miktar ile çarparak ürünün toplam fiyatı
                    }
                }
            },
            include: { basketItems: true }
        });

        // Sepet ilk oluşturulduğunda totalPrice'ı hesapla ve güncelle
        const initialTotalPrice = await calculateTotalPrice(String(basket.id));
        await db.basket.update({
            where: { id: basket.id },
            data: { totalPrice: initialTotalPrice }
        });

    } else {
        const existingItem = basket.basketItems.find(item => item.productId === productId);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            const newPrice = calculatePrice(Number(price)) * newQuantity;

            await db.basketItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity, price: newPrice }
            });
        } else {
            await db.basketItem.create({
                data: {
                    basketId: basket.id,
                    productId: String(productId),
                    quantity: quantity as number,
                    price: calculatePrice(Number(price)) * quantity
                }
            });
        }

        // Var olan sepet için totalPrice'ı hesapla ve güncelle
        const totalPrice = await calculateTotalPrice(String(basket.id));
        await db.basket.update({
            where: { id: basket.id },
            data: { totalPrice }
        });
    }

    return { basket, totalPrice: basket.totalPrice, SHIPPING_COST };
};

// increaseBasket + 1
export const increaseBasket = async ({ token, productId }: { token: string, productId: string }) => {
    let basket = await db.basket.findFirst({
        where: { token },
        include: { basketItems: true },
    });

    if (!basket) {
        //@ts-ignore
        basket = await db.basket.create({
            //@ts-ignore
            data: { token: String(token) },
            include: { basketItems: true },
        });
    }

    const product = await db.products.findFirst({ where: { id: productId } });

    if (!product) {
        throw new Error('Product not found');
    }

    const basketItem = basket?.basketItems.find((item) => item.productId === productId);

    if (basketItem) {
        // if (basketItem.quantity + 1 > product.currentStock) {
        //     throw new Error('Product stock is not enough');
        // }

        const newQuantity = basketItem.quantity + 1;
        const newPrice = calculatePrice(product.price, 0) * newQuantity;

        await db.basketItem.update({
            where: { id: basketItem.id },
            data: { quantity: newQuantity, price: newPrice }
        });
    } else {
        // if (product. === 0) {
        //     throw new Error('Product stock is not enough');
        // }
        await db.basketItem.create({
            data: { basketId: String(basket?.id), productId, quantity: 1, price: Number(product.price) },
        });
    }

    const totalPrice = await calculateTotalPrice(String(basket?.id));

    await db.basket.update({
        where: { id: basket?.id },
        data: { totalPrice }
    });

    return {
        data: {
            basket,
            SHIPPING_COST,
            totalPrice,
        },
    };
};

// decreaseBasket - 1
export const decreaseBasket = async ({ token, productId }: { token: string, productId: string }) => {
    let basket = await db.basket.findFirst({
        where: { token },
        include: { basketItems: true },
    });

    const product = await db.products.findFirst({ where: { id: productId } });

    if (!product) {
        throw new Error('Product not found');
    }

    const basketItem = basket?.basketItems.find((item) => item.productId === productId);

    if (basketItem) {
        if (basketItem.quantity === 1) {
            await db.basketItem.delete({ where: { id: basketItem.id } });
        } else {
            const newQuantity = basketItem.quantity - 1;
            const newPrice = calculatePrice(product.price, 0) * newQuantity;

            await db.basketItem.update({
                where: { id: basketItem.id },
                data: { quantity: newQuantity, price: newPrice }
            });
        }
    }

    const totalPrice = await calculateTotalPrice(String(basket?.id));

    await db.basket.update({
        where: { id: basket?.id },
        data: { totalPrice }
    });

    return {
        data: {
            basket,
            SHIPPING_COST,
            totalPrice,
        },
    };
};

export const getBasket = async () => {
    try {
        const basket = await db.basket.findMany({
            include: {
                basketItems: {
                    include: {
                        Products: true // `products` yerine `Products` yazılması gerekiyor
                    }
                }
            },
        });
        return basket
    } catch (error) {
        throw new Error("get product hatalı")
    }
}
export const deleteBasketAll = async () => {
    try {
        // Öncelikle tüm basket item'larını siliyoruz
        await db.basketItem.deleteMany({});

        // Daha sonra tüm basket'leri siliyoruz
        //  await db.basket.deleteMany({});

        return { message: "Tüm ürünler başarıyla silindi." };
    } catch (error) {
        throw new Error("Sepet ve ürünleri silme işlemi hatalı");
    }
}
