import { useState } from 'react';
import AddProductPopUp from './AddProductPopUp';
import ProductList from './ProductList';
import './admin-panel.css';
import './table-product-style.css'

export default function AdminPanelSection() {
    const [visiblePopUp, setVisiblePopUp] = useState(false);
    const [popupForAnyway, setPopupForAnyway] = useState('');

    const handlerPopUp = () => {
        setVisiblePopUp(!visiblePopUp);
        setPopupForAnyway('Додати товар')
    }
    return (
        <section className="page__admin-panel">
            <div className="admin-panel__container">
                <div className="admin-panel__title">
                    Адмін-панель
                    <span><button className="admin-panel__btn" onClick={handlerPopUp}>ДОБАВИТИ ТОВАР</button></span>
                </div>
                <div className="admin-panel__content">

                </div>
            </div>
            <AddProductPopUp visible={visiblePopUp} handleClosePopUp={handlerPopUp} />
            <div className="product-list-component__container">
                <ProductList />
            </div>
        </section>
    )
}