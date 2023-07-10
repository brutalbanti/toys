import { ChangeEvent, MouseEventHandler, useState } from "react";
import add from '../../../../source/main/add.svg';
import deleteimg from '../../../../source/main/delete.svg';
import Image from "next/image";
import InputMask from "react-input-mask";
import close from 'src/source/header/close.svg';
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/app/utils/firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { uid } from 'uid';
import { v4 } from 'uuid';

interface HandlePopUp {
    visible: boolean,
    handleClosePopUp: MouseEventHandler<HTMLImageElement> | any,
}

export default function AddProductPopUp({ visible, handleClosePopUp }: HandlePopUp) {
    const [image, setImage] = useState<any>([]);
    const [imagePreview, setImagePreview] = useState<any>([]);
    const [responseImageList, setResponseImageList] = useState<any>([]);
    const [error, setError] = useState('');
    const [succes, setSucces] = useState('');
    const [valueProduct, setValueProduct] = useState({ title: '', description: '', size: '', price: '' });
    const [handleBtnDisabled, isHandleBtnDisabled] = useState(false);

    const deleteSelectedImage = (index: number) => {
        const filterSelectedImage = image.filter((item: string, idx: number) => idx !== index);
        const filterSelectedImagePreview = imagePreview.filter((item: string, idx: number) => idx !== index);
        setImage(filterSelectedImage);
        setImagePreview(filterSelectedImagePreview);
    }

    const handlerValueTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: e.target.value, description: valueProduct.description, size: valueProduct.size, price: valueProduct.price })
    }
    const handlerValueDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValueProduct({ title: valueProduct.title, description: e.target.value, size: valueProduct.size, price: valueProduct.price })
    }
    const handlerValueSize = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: valueProduct.title, description: valueProduct.description, size: e.target.value, price: valueProduct.price })
    }
    const handlerValuePrice = (e: ChangeEvent<HTMLInputElement>) => {
        setValueProduct({ title: valueProduct.title, description: valueProduct.description, size: valueProduct.size, price: e.target.value })
    }


    const submitAddProduct = (e: any) => {
        e.preventDefault()
        if (!valueProduct.title || !valueProduct.description || !valueProduct.size || !valueProduct.price || image.length < 2) {
            setError('Потрібно заповнити всі поля та додати мінімум 2 фото')
        } else {
            isHandleBtnDisabled(true);
            setTimeout(function () {
                isHandleBtnDisabled(false);
            }, 5000)
            const uidd = uid();
            setError('');
            const imageRef = ref(storage, `images/${uidd}/${image[0].name + v4()}`);
            const imageRefTwo = ref(storage, `images/${uidd}/${image[1].name + v4()}`);
            uploadBytes(imageRef, image[0]).then(() => console.log('Удача'));
            uploadBytes(imageRefTwo, image[1]).then(() => console.log('Удача'));
            if (image.length > 2) {
                const imageRefThree = ref(storage, `images/${uidd}/${image[2].name + v4()}`);
                uploadBytes(imageRefThree, image[2]).then(() => console.log('Удача'));
            }

            let imagelist: any = [];
            setTimeout(function () {
                // responceImage(uidd, imagelist);
                const responseImageRef = ref(storage, `images/${uidd}/`);

                listAll(responseImageRef).then((response) => {
                    response.items.map((item) => {
                        getDownloadURL(item).then((url) => {
                            imagelist = ([...imagelist, url])
                            console.log(imagelist);
                        })
                    })
                })
            }, 3000)


            setTimeout(function () {
                console.log(imagelist)
                addDoc(collection(db, `goods`), {
                    title: valueProduct.title,
                    description: valueProduct.description,
                    size: valueProduct.size,
                    price: valueProduct.price,
                    image: imagelist,
                    uid: uidd
                });
                setSucces('Товар додано')
                handleClosePopUp();
                setTimeout(function () {
                    setSucces('');
                }, 2000)
                imagelist = [];
            }, 5000)
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
                                        if(event.target) {
                                            if (image.length < 3) {
                                                setImage([...image, event.target.files[0]]);
                                                setImagePreview([...imagePreview, URL.createObjectURL(event.target.files[0])]);
                                            }
                                        }
                                    }} />
                                    <span className="input__file-icon-wrapper"><Image className="input__file-icon" src={add} alt="Выбрать файл" width="25" /></span>
                                </label>
                            </div>
                            <div className="selected-image__content">
                                {imagePreview.map((item: string, index: number) => (
                                    <div className="image__item" key={index}>
                                        <img src={item} alt="Обране фото товару" className="selected-image" />
                                        <Image src={deleteimg} alt='Кнопка видалення фото' className="image-delete" onClick={() => deleteSelectedImage(index)} />
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
                        <button className="add-product__btn" onClick={(e) => submitAddProduct(e)} disabled={handleBtnDisabled}>
                            {handleBtnDisabled ?
                                <span className="loader"></span> :
                                'ДОДАТИ'
                            }
                        </button> :
                    </form>
                </div>
            </div>
            <div className={succes !== '' ? "succes-message active" : "succes-message"}>
                {succes}
            </div>
        </>
    )
}