'use client'

import Footer from "@/app/Component/Footer/Footer";
import Header from "@/app/Component/Header/Header";
import MainProfile from "@/app/Component/Main/MainProfile";
import { useEffect, useState } from "react";
import 'src/app/globals.css'

export default function MyProfile() {
    const [countBasket, setCountBasket] = useState<number>(0);
    const [countFavotire, setCountFavorite] = useState<number>(0);

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
            console.log(total)
            setCountBasket(total);
        }
    }

    return (
        <div className="wrapper">
            <Header totalBasketFunc={totalBasket} countBasketArr={countBasket} countFavorite={countFavotire} totalFavoriteFunc={totalFavorite}/>
            <MainProfile />
            <Footer />
        </div>
    )
}