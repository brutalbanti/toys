import HeaderSearch from "../Header/HeaderSearch";
import BannerSection from "../Section/BannerSection";
import GoodsSection from "../Section/GoodsSection";

interface FuncInt {
    totalBasketFunc: any,
    totalFavoriteFunc: any
}
export default function MainHome({totalBasketFunc, totalFavoriteFunc}: FuncInt) {
    return (
        <main className="page">
            <BannerSection/>
            <GoodsSection totalBasketFunc={totalBasketFunc} totalFavoriteFunc={totalFavoriteFunc}/>
        </main>
    )
}