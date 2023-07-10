import { db } from "@/app/utils/firebase";
import { ChangeEvent, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import './product.detail.css'
import Image from "next/image";
import ReactHtmlParser from 'react-html-parser';
import heart from 'src/source/main/heart.svg';
import heartSelect from 'src/source/main/heart-select.svg';


interface Product {
    title: string,
    description: string,
    uid: string,
    image: any,
    price: string,
    size: string,
    id: string
}

interface FuncInt {
    totalBasketFunc: any,
    totalFavoriteFunc: any
}
export default function ProductSection({ totalBasketFunc, totalFavoriteFunc }: FuncInt) {
    const router = useRouter();
    const { id } = router.query;
    console.log(id)
    const [product, setProduct] = useState<Product | any>(null);
    const [productList, setProductList] = useState<any>(null);
    const [toggleTabs, setToggleTabs] = useState(1);
    const [reviews, setReviews] = useState(null);
    const [messageBasket, setMessageBasket] = useState('');
    const [reviewsValue, setReviewsValue] = useState({ name: '', email: '', description: '' });
    const [previewFullImage, setPreviewFullImage] = useState<null | string>(null);
    const [localStorageFavorite, setLocalStorageFavorite] = useState<any>(false);

    useEffect(() => {
        const dataProduct = async () => {
            let col: any = [];
            const colRef = collection(db, 'goods');
            const snapshot = await getDocs(colRef);
            const data = snapshot.docs.map((doc) => col.push({ ...doc.data(), id: doc.id }));
            const filterProduct = col.filter((el: Product, idx: number) => el.id === id);
            setProductList(col)
            if (filterProduct.length !== 0) {
                setProduct(filterProduct);
                console.log(filterProduct);
            }
        }
        dataProduct();
        checkFavoriteList();
    }, [id]);
    const checkFavoriteList = () => {
        if (localStorage.getItem('favorite')) {
            const localFavorite: any = localStorage.getItem('favorite');
            const parseLocalFavorite = JSON.parse(localFavorite);
            setLocalStorageFavorite(parseLocalFavorite);
        }
    }
    const isFavorite = (productId: any) => {
        return localStorageFavorite.some((favoriteProduct: any) => favoriteProduct.id === productId);
    };
    const handlerToggleTabs = (index: number) => {
        setToggleTabs(index);
    }

    const handlerValueName = (e: ChangeEvent<HTMLInputElement>) => {
        setReviewsValue({ name: e.target.value, email: reviewsValue.email, description: reviewsValue.description })
    }
    const handlerValueEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setReviewsValue({ name: reviewsValue.name, email: e.target.value, description: reviewsValue.description })
    }
    const handlerValueDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setReviewsValue({ name: reviewsValue.name, email: reviewsValue.email, description: e.target.value })
    }

    const changeFullImage = (link: string) => {
        setPreviewFullImage(link);
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
    if (product !== null) {

        return (
            <section className="page__details-product">
                <div className="detail-product__container">
                    {product !== null &&
                        <h1 className="detail-product__title">
                            {product[0].title}
                        </h1>
                    }
                    <div className="detail-product__content">
                        <div className="detail-product__left">
                            <div className="detail-left__image">
                                {previewFullImage === null ?
                                    <Image src={product[0].image[0]} alt="Перше фото товару" width={350} height={465} priority />
                                    :
                                    <Image src={previewFullImage} alt="Перше фото товару" width={350} height={465} priority />
                                }
                            </div>
                            <div className="detail-left__images">
                                {product[0].image.map((item: any, index: number) => (
                                    <Image src={item} alt="Фото товару" key={index} width={86} height={115} onClick={() => changeFullImage(item)} priority />
                                ))}
                            </div>
                        </div>
                        <div className="detail-product__right">
                            <div className="detail-product__size">
                                <h3 className="detail-size__title">
                                    Розмір
                                </h3>
                                <div className="detail-size__content">
                                    {product[0].size} СМ
                                </div>
                            </div>
                            <div className="detail-right__price">
                                Ціна:
                                <b>{product[0].price} грн</b>
                            </div>
                            <div className="detail-right__availabel">
                                <b>В наявності</b>
                            </div>
                            <div className="detail-right__button">
                                <button className="detail-button__add-product" onClick={() => addProductToBasket(product[0])}>
                                    В корзину
                                </button>
                            </div>
                            <div className="detail-right__tabs-content">
                                <div className="detail-right__tabs">
                                    <button className={toggleTabs === 1 ? "detail-tabs__btn active" : "detail-tabs__btn"} onClick={() => handlerToggleTabs(1)}>Опис</button>
                                    <button className={toggleTabs === 2 ? "detail-tabs__btn active" : "detail-tabs__btn"} onClick={() => handlerToggleTabs(2)}>Відгуки</button>
                                </div>
                                <div className={toggleTabs === 1 ? "detail-right__description active" : "detail-right__description"}>
                                    {ReactHtmlParser(product[0].description)}
                                </div>
                                <div className={toggleTabs === 2 ? "detail-right__reviews active" : "detail-right__reviews"}>
                                    {reviews === null &&
                                        <div className="reviews__title">Відгуків про цей товар немає. Стань першим серед інших, та напиши відгук</div>
                                    }
                                    <div className="reviews__form">
                                        <div className="reviews-form__title">Додати відгук</div>
                                        <div className="reviews-form__content">
                                            <input type="text" className="reviews-form__input" placeholder="Введіть ім'я" value={reviewsValue.name} onChange={(e) => handlerValueName(e)} />
                                            <input type="email" className="reviews-form__input email" placeholder="Введіть електронну пошту" value={reviewsValue.email} onChange={(e) => handlerValueEmail(e)} />
                                            <textarea name="" id="" cols={35} rows={6} className="reviews-form__textarea" placeholder="Додайте коментар" value={reviewsValue.description} onChange={(e) => handlerValueDescription(e)}></textarea>
                                            <div className="reviews-form__button">
                                                <button>Відправити</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="carousel__container">
                    <h3 className="carousel__title">
                        РЕКОМЕНДУЄМО
                    </h3>
                    <div className="carousel__content">
                        {productList !== null &&
                            productList.map((item: any, idx: number) => (
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
                <div className={messageBasket !== '' ? "message-basket active" : "message-basket"}>
                    {messageBasket}
                </div>
            </section >
        )
    } else {
        return (
            <div className="loader__container">
                <div className="loader__content">
                    <span className="loader"></span>
                </div>
            </div>
        )
    }
}