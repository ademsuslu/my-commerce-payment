import { deleteBasketAll, getBasket } from "@/actions/actions";
import { Button } from "@/components/ui/button";

export default async function CartPage() {

  const basket = await getBasket();

  // Sepet boşsa items değişkenini boş bir dizi olarak ayarlıyoruz
  const items = basket.length > 0 ? basket[0].basketItems : [];



  return (
    <div className="flex flex-col container mx-auto">
      <h1 className="text-xl my-2">Basketteki ürünler listelenecek</h1>

      <div className="grid grid-rows-1 md:grid-rows-3 lg:grid-rows-5 gap-4">
        {items.length > 0 ? (
          items.map(product => (
            <div key={product.id} className="border flex flex-row justify-between hover:shadow-md">
              <div className="flex">
                <div className="w-24 h-32 object-contain">
                  <img src={product.Products.image} alt={product.Products.title} className="w-full h-full object-cover" />
                </div>
                <div className="my-5 flex flex-col space-y-2 px-2">
                  <h1>{product.Products.title}</h1>
                  <p>{product.Products.description}</p>
                  <b className="bg-green-500 p-1 text-white rounded">{product.Products.price} TL</b>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant={"default"}>Arttır</Button>
                <span className="p-3">{product.quantity}</span>
                <Button variant={"default"}>Azalt</Button>
              </div>
            </div>
          ))
        ) : (
          <p>Sepetinizde ürün bulunmamaktadır.</p>
        )}
      </div>

    </div>
  );
}
