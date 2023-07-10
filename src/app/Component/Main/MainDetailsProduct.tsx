import ProductSection from "../Section/DetailsProduct/ProductSection";

interface FuncInt {
    totalBasketFunc: any,
    totalFavoriteFunc: any
}

export default function MainDetailsProduct({ totalBasketFunc, totalFavoriteFunc }: FuncInt) {
    return (
        <main className="page">
            <ProductSection totalBasketFunc={totalBasketFunc} totalFavoriteFunc={totalFavoriteFunc}/>
        </main>
    )
}