import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import add from '../../../../source/main/add.svg';
import deleteimg from '../../../../source/main/delete.svg';
import Image from "next/image";
import InputMask from "react-input-mask";
import close from 'src/source/header/close.svg';
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/app/utils/firebase";

interface HandlePopUp {
    visible: boolean,
    handleClosePopUp: MouseEventHandler<HTMLImageElement> | any,
    productForChange: any,
    dataProductFunc: any
}

export default function ChangeProductPopUp({ visible, handleClosePopUp, productForChange, dataProductFunc }: HandlePopUp) {
    const [image, setImage] = useState<any>([]);
    const [imagePreview, setImagePreview] = useState<any>([]);
    const [error, setError] = useState('');
    const [succes, setSucces] = useState('');
    const [valueProduct, setValueProduct] = useState<any>({ title: '', description: '', size: '', price: '', image: [], uid: '' });
    const [handleBtnDisabled, isHandleBtnDisabled] = useState(false);

    useEffect(() => {
        setValueProduct({ title: productForChange.title, description: productForChange.description, size: productForChange.size, price: productForChange.price, image: productForChange.image, id: valueProduct.id, uid: valueProduct.uid});
        console.log(productForChange);
    }, [productForChange])

    const handlerValueTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: e.target.value, description: valueProduct.description, size: valueProduct.size, price: valueProduct.price, image: valueProduct.image, id: valueProduct.id, uid: valueProduct.uid })
        console.log(valueProduct)
    }
    const handlerValueDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValueProduct({ title: valueProduct.title, description: e.target.value, size: valueProduct.size, price: valueProduct.price, image: valueProduct.image, id: valueProduct.id, uid: valueProduct.uid })
    }
    const handlerValueSize = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: valueProduct.title, description: valueProduct.description, size: e.target.value, price: valueProduct.price, image: valueProduct.image, id: valueProduct.id, uid: valueProduct.uid })
    }
    const handlerValuePrice = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: valueProduct.title, description: valueProduct.description, size: valueProduct.size, price: e.target.value, image: valueProduct.image, id: valueProduct.id, uid: valueProduct.uid })
    }


    const submitChangeProduct = async (e: any) => {
        e.preventDefault()
        if (!valueProduct.title || !valueProduct.description || !valueProduct.size || !valueProduct.price) {
            setError('Потрібно заповнити всі поля')
        } else {
            const formattedDescription = valueProduct.description.replace(/\n/g, '<p>');
            isHandleBtnDisabled(true);
            setTimeout(function () {
                isHandleBtnDisabled(false);
            }, 5000)
            setError('');
            const getGoods = doc(db, 'goods', productForChange.id);
            console.log(valueProduct.uid);
            await updateDoc(getGoods, {
                title: valueProduct.title,
                description: formattedDescription,
                size: valueProduct.size,
                price: valueProduct.price,
                image: valueProduct.image,
                uid: valueProduct.uid,
            });
            setSucces('Товар змінено')
            handleClosePopUp();
            dataProductFunc();
            setTimeout(function () {
                setSucces('');
            }, 2000)
        }
    }
    return (
        <>
            <div className={visible ? "add-product__popup active" : "add-product__popup"}>
                <div className="add-product-popup__container">
                    <form className="add-product-popup__form">
                        <Image src={close} alt="" className="close-button-popup" onClick={handleClosePopUp} />
                        <div className="content-image__title">ФОТО</div>
                        <div className="form-content__image">
                            <div className="input__wrapper">
                                <label htmlFor="input__file" className="input__file-button">
                                    <input type="file" className="input__file" onChange={(event: any) => {
                                        if (image.length < 3) {
                                            setImage([...image, event.target.files[0]]);
                                            setImagePreview([...imagePreview, URL.createObjectURL(event.target.files[0])]);
                                        }
                                    }} />
                                    <span className="input__file-icon-wrapper"><Image className="input__file-icon" src={add} alt="Выбрать файл" width="25" /></span>
                                </label>
                            </div>
                            <div className="selected-image__content">
                                {productForChange.image.map((item: string, index: number) => (
                                    <div className="image__item" key={index}>
                                        <img src={item} alt="Обране фото товару" className="selected-image" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="content-image__title about__product">Про товар</div>
                        <div className="form-input__wrapper">
                            <input type="text" className="product-form__input" placeholder="Заголовок" value={valueProduct.title} onChange={(e) => handlerValueTitle(e)} />
                            <InputMask mask='99/99' className="product-form__input" placeholder="Розмір" value={valueProduct.size} onChange={(e) => handlerValueSize(e)} />
                            <input type="number" className="product-form__input" placeholder="Ціна" value={valueProduct.price} onChange={(e) => handlerValuePrice(e)} />
                            <textarea name="" id="" cols={30} rows={10} placeholder="Опис товару" className="product-form__textarea" value={valueProduct.description} onChange={(e) => handlerValueDescription(e)}></textarea>
                        </div>
                        {error !== '' &&
                            <div className="error-message">
                                {error}
                            </div>
                        }
                        <button className="add-product__btn" onClick={(e) => submitChangeProduct(e)} disabled={handleBtnDisabled}>
                            {handleBtnDisabled ?
                                <span className="loader"></span> :
                                'Змінити'
                            }
                        </button>
                    </form>
                </div>
            </div>
            <div className={succes !== '' ? "succes-message active" : "succes-message"}>
                {succes}
            </div>
        </>
    )
}