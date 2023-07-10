'use client'

import Image from 'next/image'
import Header from './Component/Header/Header'
import Footer from './Component/Footer/Footer'
import MainHome from './Component/Main/MainHome'
import { useEffect, useState } from 'react';

export default function Home() {
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
      <MainHome totalBasketFunc={totalBasket} totalFavoriteFunc={totalFavorite}/>
      <Footer />
    </div>
  )
}
