'use client';

import { use, useEffect, useState } from "react";

import Image from "next/image";
import login from 'src/source/header/login.svg';
import likes from 'src/source/header/likes.svg';
import basket from 'src/source/header/basket.svg';
import logo from 'src/source/header/logo2.png';
import './header.css'
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";
import Authentication from "../Authentication/Authentication";
import { auth } from "@/app/utils/firebase";
import close from 'src/source/header/close.svg';
import deletedBTN from 'src/source/main/delete.svg';


interface TotalBasketInt {
    totalBasketFunc: any,
    countBasketArr: number,
    countFavorite: number,
    totalFavoriteFunc: any
}

export default function Header({ totalBasketFunc, countBasketArr, countFavorite, totalFavoriteFunc }: TotalBasketInt) {
    const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
    const [menu_class, setMenuClass] = useState("menu hidden");
    const [basket_class, setBasketClass] = useState("")
    const [favorite_class, setFavoriteClass] = useState("")
    const [isMenuClicked, setIsMenuClicked] = useState(false);
    const [signPopUp, setSignPopUp] = useState(false);
    const [authSucces, setAuthSucces] = useState(false);
    const [countBasket, setCountBasket] = useState<number>(0);
    const [localGoods, setLocalGoods] = useState<any>(false);
    const [localGoodsFavorite, setLocalGoodsFavorite] = useState<any>(false);
    const [messageBasket, setMessageBasket] = useState<string>('');


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setAuthSucces(true)
            } else {
                setAuthSucces(false)
            }
        })
        allProductLocal();
        totalBasketFunc();
        allProductFavoriteLocal();
        setCountBasket(countBasketArr);
    }, [countBasketArr, countFavorite])


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

    const updateMenu = () => {
        if (!isMenuClicked) {
            setBurgerClass("burger-bar clicked");
            setMenuClass("menu visible")
        } else {
            setBurgerClass("burger-bar unclicked");
            setMenuClass("menu hidden")
        }
        setIsMenuClicked(!isMenuClicked)
    }


    const allProductLocal = () => {
        if (localStorage.getItem('basket')) {
            const localBasket: any = localStorage.getItem('basket');
            const parseBasketData = JSON.parse(localBasket);
            setLocalGoods(parseBasketData);
            if (parseBasketData.length === 0) {
                localStorage.removeItem('basket');
                setLocalGoods(false)
            }
        }

    }

    const allProductFavoriteLocal = () => {
        if (localStorage.getItem('favorite')) {
            const localFavoriteList: any = localStorage.getItem('favorite');
            const parseFavoriteList = JSON.parse(localFavoriteList);
            setLocalGoodsFavorite(parseFavoriteList);
            console.log(parseFavoriteList)
            if (parseFavoriteList.length === 0) {
                localStorage.removeItem('favorite');
                setLocalGoodsFavorite(false)
            }
        }

    }

    const handlerVisibleFavorite = () => {
        if (favorite_class === "active") {
            setFavoriteClass("");
        } else {
            setFavoriteClass("active");
        }
    }

    const handlerVisibleBasket = () => {
        if (basket_class === "active") {
            setBasketClass("");
        } else {
            setBasketClass("active");
        }
    }

    const handlerSignPopUp = () => {
        setSignPopUp(!signPopUp);
    }


    const deleteProductBasket = (idx: number) => {
        const localProduct: any = localStorage.getItem('basket');
        const parseLocalProductFilter = JSON.parse(localProduct).filter((item: any, index: number) => idx !== index);
        localStorage.setItem('basket', JSON.stringify(parseLocalProductFilter));
        setLocalGoods(parseLocalProductFilter);
        totalBasketFunc();
        allProductLocal();
    }
    const deleteProductFavorite = (idx: number) => {
        const localProduct: any = localStorage.getItem('favorite');
        const parseLocalProductFilter = JSON.parse(localProduct).filter((item: any, index: number) => idx !== index);
        console.log(parseLocalProductFilter)
        localStorage.setItem('favorite', JSON.stringify(parseLocalProductFilter));
        setLocalGoods(parseLocalProductFilter);
        totalFavoriteFunc();
        allProductFavoriteLocal();
    }

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__menu">
                    <nav className={"nav__menu menu " + menu_class}>
                        <div className="blur"></div>
                        <ul className="menu__list">
                            <li className="menu__item">
                                <Link href="" className="menu__link">Про нас</Link>
                            </li>
                            <li className="menu__item">
                                <Link href="" className="menu__link">Оплата та доставка</Link>
                            </li>
                            <li className="menu__item">
                                <Link href="" className="menu__link">Блог</Link>
                            </li>
                            <li className="menu__item">
                                <Link href="" className="menu__link">Контакти</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="header__center">
                    <a href="/" className="header-logo"><Image src={logo} alt="Логотип сайту" width={70} height={70} /></a>
                    <h2 className="header__title">ІНТЕРНЕТ-МАГАЗИН ІГРАШОК РУЧНОЇ РОБОТИ</h2>
                    <div className="header__right">
                        {authSucces ?
                            <Link href='/my-profile' className="header-right__authorization header-right-component f-col align-center ">
                                <Image src={login} alt="" />
                                <span>Кабінет</span>
                            </Link>
                            :
                            <div className="header-right__authorization header-right-component f-col align-center " onClick={handlerSignPopUp}>
                                <Image src={login} alt="" />
                                <span>Увійти</span>
                            </div>
                        }
                        <div className="header-right__likes header-right-component f-col align-center" onClick={handlerVisibleFavorite}>
                            <Image src={likes} alt="" />
                            <span>{countFavorite} шт</span>
                        </div>
                        <div className={"favorite " + "basket-content " + favorite_class}>
                            <Image src={close} alt="Закрити кошик" className="close-basket" onClick={handlerVisibleFavorite} />
                            <div className="basket-title">СПИСОК ВПОДОБАНИХ</div>
                            <div className="basket-content__items">
                                {localGoodsFavorite === false ?
                                    <p className="basket-content__zero">
                                        СПИСОК ПОРОЖНІЙ
                                    </p>
                                    :
                                    localGoodsFavorite.map((item: any, idx: number) => (
                                        <div className="basket-content__item" key={idx}>
                                            <div className="item-content__left">
                                                <img src={item.image[0]} alt="" width={50} height={70} />
                                                <div className="basket-item__name">
                                                    <p>{item.title}</p>
                                                    <p className="basket-item__price">
                                                        Ціна
                                                        <span>{item.price}₴</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="button-favorite-content">
                                                <Image src={deletedBTN} alt="Видалити товар з корзини" className="basket-item__delete" onClick={() => deleteProductFavorite(idx)} />
                                                <button className="add-product-basket" onClick={() => addProductToBasket(item)}>
                                                    В КОРЗИНУ
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="header-right__basket header-right-component f-col align-center" onClick={handlerVisibleBasket}>
                            <Image src={basket} alt="" />
                            <span>{countBasket} грн</span>
                        </div>
                        <div className={"basket-content " + basket_class}>
                            <Image src={close} alt="Закрити кошик" className="close-basket" onClick={handlerVisibleBasket} />
                            <div className="basket-title">КОШИК</div>
                            <div className="basket-content__items">
                                {localGoods === false ?
                                    <p className="basket-content__zero">
                                        КОШИК ПОРОЖНІЙ
                                    </p>
                                    :
                                    localGoods.map((item: any, idx: number) => (
                                        <div className="basket-content__item" key={idx}>
                                            <div className="item-content__left">
                                                <img src={item.image[0]} alt="" width={50} height={70} />
                                                <div className="basket-item__name">
                                                    <p>{item.title}</p>
                                                    <p className="basket-item__price">
                                                        Ціна
                                                        <span>{item.price}₴</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <Image src={deletedBTN} alt="Видалити товар з корзини" className="basket-item__delete" onClick={() => deleteProductBasket(idx)} />
                                        </div>
                                    ))
                                }
                            </div>
                            {localGoods !== false &&
                                <>
                                    <div className="basket-content__total-amount">
                                        ЗАГАЛЬНА СУМА
                                        <span>{countBasket}₴</span>
                                    </div>
                                    <div className="basket-button__block">
                                        <Link href='/basket' className="basket-content__button">ОФОРМИТИ ЗАМОВЛЕННЯ</Link>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className={burger_class === 'burger-bar clicked' ? "burger-menu active" : "burger-menu"} onClick={updateMenu}>
                        <div className={'one ' + burger_class}></div>
                        <div className={'two ' + burger_class}></div>
                        <div className={'three ' + burger_class}></div>
                    </div>
                </div>
                <HeaderSearch />
            </div>
            <Authentication handlePopUp={signPopUp} handlerClose={handlerSignPopUp} />
            <div className={messageBasket !== '' ? "message-basket active" : "message-basket"}>
                {messageBasket}
            </div>
        </header>
    )
}