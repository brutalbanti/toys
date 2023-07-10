'use client'

import Footer from "@/app/Component/Footer/Footer";
import Header from "@/app/Component/Header/Header";
import MainBasket from "@/app/Component/Main/MainBasket";
import { useEffect, useState } from "react";
import 'src/app/globals.css'

export default function Basket() {

    const [countBasket, setCountBasket] = useState<number>(0);
    const [countFavorite, setCountFavorite] = useState<number>(0);

    useEffect(() => {
        totalBasket();
        totalFavorite();
    }, [])


    const totalFavorite = () => {
        if (localStorage.getItem('favorite')) {
            const localFavorite: any = localStorage.getItem('favorite');
            const parseFavoriteData = JSON.parse(localFavorite).length;
            setCountFavorite(parseFavoriteData);
        }
    }

    const totalBasket = () => {
        if (localStorage.getItem('basket')) {
            const localBasket: any = localStorage.getItem('basket');
            const parseBasketData = JSON.parse(localBasket);
            let total = 0;
            parseBasketData.map((item: any) => total += (Number(item.price)));
            setCountBasket(total);
        }
    }
    return (
        <div className="wrapper">
            <Header totalBasketFunc={totalBasket} countBasketArr={countBasket} countFavorite={countFavorite} totalFavoriteFunc={totalFavorite}/>
            <MainBasket totalBasketFunc={totalBasket} countBasket={countBasket}/>
            <Footer/>
        </div>
    )
}