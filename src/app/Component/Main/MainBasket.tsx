import BasketSection from "../Section/Basket/BasketSection";

interface FuncInt {
    totalBasketFunc: any,
    countBasket: number
}
export default function MainBasket({totalBasketFunc, countBasket}: FuncInt) {
    return (
        <main className="page">
            <BasketSection totalBasketFunc={totalBasketFunc} countBasket={countBasket}/>
        </main>
    )
}