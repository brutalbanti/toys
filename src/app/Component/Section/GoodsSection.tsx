'use client'

import Image from "next/image";
import heart from 'src/source/main/heart.svg';
import heartSelect from 'src/source/main/heart-select.svg';

import './product.css';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
interface FuncInt {
    totalBasketFunc: any,
    totalFavoriteFunc: any
}
export default function GoodsSection({ totalBasketFunc, totalFavoriteFunc }: FuncInt) {
    const [dataProductList, setDataProductList] = useState<any>([]);
    const [messageBasket, setMessageBasket] = useState('');
    const [localStorageFavorite, setLocalStorageFavorite] = useState<any>(false);

    const dataProduct = async () => {
        let col: any = [];
        const colRef = collection(db, 'goods');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => col.push({ ...doc.data(), id: doc.id }));
        setDataProductList(col);
    }

    useEffect(() => {
        dataProduct();
        checkFavoriteList();
    }, [totalFavoriteFunc]);

    const isFavorite = (productId: any) => {
        return localStorageFavorite.some((favoriteProduct: any) => favoriteProduct.id === productId);
      };

    const checkFavoriteList = () => {
        if (localStorage.getItem('favorite')) {
            const localFavorite: any = localStorage.getItem('favorite');
            const parseLocalFavorite = JSON.parse(localFavorite);
            setLocalStorageFavorite(parseLocalFavorite);
        }
    }
    const addProductToFavorite = (selectedItem: any) => {
        if (localStorage.getItem('favorite')) {
            const storageFavorite: any = localStorage.getItem('favorite');
            const parseStorageFavorite = JSON.parse(storageFavorite).filter((item: any) => item.id === selectedItem.id);
            if (parseStorageFavorite.length === 1) {
                setMessageBasket('Товар вже в спискі вподобаних');
                setTimeout(function () {
                    setMessageBasket('');
                }, 2000);
            } else {
                selectedItem.cheker = true;
                console.log(selectedItem);
                const selectedProduct: any = [...JSON.parse(storageFavorite).map((item: any) => (item)), selectedItem];
                localStorage.setItem('favorite', JSON.stringify(selectedProduct));
                setMessageBasket('Успішно додано до вподобаних');
                setTimeout(function () {
                    setMessageBasket('');
                }, 2000);
                totalFavoriteFunc();
                checkFavoriteList();
            }
        } else {
            selectedItem.cheker = true;
            const selectedProduct: any = [selectedItem];
            localStorage.setItem('favorite', JSON.stringify(selectedProduct));
            setMessageBasket('Успішно додано до вподобаних');
            setTimeout(function () {
                setMessageBasket('');
            }, 2000);
            totalFavoriteFunc();
            checkFavoriteList();
        }
    }

    const addProductToBasket = (selectedItem: any) => {
        if (localStorage.getItem('basket')) {
            const storageBasket: any = localStorage.getItem('basket');
            const parseStorageBasket = JSON.parse(storageBasket).filter((item: any) => item.id === selectedItem.id);
            if (parseStorageBasket.length === 1) {
                setMessageBasket('Товар вже в корзині');
                setTimeout(function () {
                    setMessageBasket('');
                }, 2000);
            } else {
                const selectedProduct: any = [...JSON.parse(storageBasket).map((item: any) => (item)), selectedItem];
                localStorage.setItem('basket', JSON.stringify(selectedProduct));
                setMessageBasket('Успішно додано до корзини');
                setTimeout(function () {
                    setMessageBasket('');
                }, 2000);
                totalBasketFunc();
            }
        } else {
            const selectedProduct: any = [selectedItem];
            console.log(selectedItem)
            localStorage.setItem('basket', JSON.stringify(selectedProduct));
            setMessageBasket('Успішно додано до корзини');
            setTimeout(function () {
                setMessageBasket('');
            }, 2000);
            totalBasketFunc()
        }
    }
    return (
        <section className="page__goods">
            <div className="goods__container">
                <div className="goods__title">ВСІ ІГРАШКИ</div>
                <div className="goods-content">
                    <div className="goods__items">
                        {dataProductList.map((item: any, idx: number) => (
                            <article className="goods__item" key={idx}>
                                <div className="heart-image__content">
                                    <>
                                        {localStorageFavorite !== false
                                            ?
                                            isFavorite(item.id)
                                                ?
                                                <Image src={heartSelect} alt="Доданий товар до списку вподобаних" className="heart-image" />
                                                :
                                                <Image src={heart} alt="Додати товар до списку вподобаних" className="heart-image" onClick={() => addProductToFavorite(item)} />
                                            :
                                            <Image src={heart} alt="Додати товар до списку вподобаних" className="heart-image" onClick={() => addProductToFavorite(item)} />
                                        }
                                    </>
                                </div>
                                <a href={`/product?id=${item.id}`} className="goods-item__product">
                                    <img src={item.image[0]} alt='Фото товару' className="product__image" />
                                    <h3 className="product__title">{item.title}</h3>
                                    <div className="product__price">
                                        <div className="price__content">
                                            Ціна
                                            <span>{item.price}грн</span>
                                        </div>
                                    </div>
                                    <div className="product-stock">
                                        В наявності
                                    </div>
                                </a>
                                <button className="product__button" onClick={() => addProductToBasket(item)}>В корзину</button>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
            <div className={messageBasket !== '' ? "message-basket active" : "message-basket"}>
                {messageBasket}
            </div>
        </section>
    )
}