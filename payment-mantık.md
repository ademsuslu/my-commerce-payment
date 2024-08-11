http://localhost:3000/magazam/products/66ae2a94fdaa2b9fac5779ed => 
1) sepet ekle dedıgınde ilk basket daha sonra basket ıtem olustrulucak eğer onceden baskte olusturulmamış ise 
forexample:db.basket.create({
    basketItem: {
    create: {...
    }
})

2) http://localhost:3000/magazam/cart 
+ bu sayfaya hesaplanmıs bır sekılde gelıcek   => cart sayfayı her yüklendiğinde ürünlerin fiyat ve stok değerini çekip güncelleme yapması lazım

+ her kişinin bır basketı olacak ve oradan cekıcek basketı

3) http://localhost:3000/magazam/shipping
+ ama bu sayfa içinde güncelleme yapmsı lazım
+ bu sayfada fiyat stok tekrardan guncelleme yapılıcak doğrumu kontrol edılicek


4) http://localhost:3000/magazam/payment 
+ bu kısımdan sonrası payment 
+ bu kısımda güncel basket  cekılıp gonderılıcek
+  eğer ödeme işlemi başarılı ise order ve orderItem olusturuluacak
forexample;forexample:db.order.create({
/* 
ödeme tamamlanınca result içinde bir id gönder
o idyi paramposa istek atıp başarılı olup olmadığını kontrol et
ondan sonra order oluştur
// resulttan dönen sonuçu order ıcınde tutulabılır
*/
orderItem: {
    create: {...
   
    }
})


<!--! çözülmesi gereken yerler onemlı -->

- ödeme alındıgında  alışveriş yaptıgında stokdan düşücek
