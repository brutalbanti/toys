'use client'

import Footer from "@/app/Component/Footer/Footer";
import Header from "@/app/Component/Header/Header";
import MainDetailsProduct from "@/app/Component/Main/MainDetailsProduct";
import Head from "next/head";
import { useEffect, useState } from "react";
import 'src/app/globals.css'

export default function Product() {
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
        <>
            <Head>
                <title>Товар</title>
                <meta name="description" content="Товар" />
            </Head>
            <div className="wrapper">
                <Header totalBasketFunc={totalBasket} countBasketArr={countBasket} countFavorite={countFavorite} totalFavoriteFunc={totalFavorite} />
                <MainDetailsProduct totalBasketFunc={totalBasket} totalFavoriteFunc={totalFavorite}/>
                <Footer />
            </div>
        </>
    )
}