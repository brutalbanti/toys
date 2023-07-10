import { db, storage } from "@/app/utils/firebase";
import { collection, deleteDoc, deleteField, doc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, ref, listAll } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import deletedBTN from 'src/source/main/delete.svg';
import change from 'src/source/main/change.svg';
import AddProductPopUp from "./AddProductPopUp";
import ChangeProductPopUp from "./ChangeProductPopUp";

export default function ProfuctList() {
    const [productList, setProductList] = useState<any>([]);
    const [visiblePopUp, setVisiblePopUp] = useState(false);
    const [productForChange, setProductForChange] = useState<any>({ title: '', description: '', size: '', price: '', image: [], uid: '' });
    const dataProduct = async () => {
        let col: any = [];
        const colRef = collection(db, 'goods');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => col.push({ ...doc.data(), id: doc.id }));
        setProductList(col);
    }
    useEffect(() => {
        dataProduct();
    }, []);

    const changeVisiblePopUp = async (id: string) => {
        setVisiblePopUp(!visiblePopUp);
        if (visiblePopUp === false) {
            const filterChangeProduct = productList.filter((item: any, idx: number) => item.id === id);
            const retrievedDescription = filterChangeProduct[0].description.replace(/<p>/g, '\n');
            setProductForChange({
                description: retrievedDescription,
                title: filterChangeProduct[0].title,
                uid: filterChangeProduct[0].uid,
                id: filterChangeProduct[0].id,
                size: filterChangeProduct[0].size,
                price: filterChangeProduct[0].price,
                image: filterChangeProduct[0].image
            });
        } else {
            setProductForChange({ title: '', description: '', size: '', price: '', image: [], uid: '' });
        }

    }
    const handlerDeleteDoc = async (id: string) => {
        const docRef = doc(db, `goods`, id);
        const resultFilter = productList.filter((item: any, idx: number) => item.id === id)[0].uid;
        const desertRef = ref(storage, `images/${resultFilter}/`);
        const fileList = await listAll(desertRef)
        const promises = [];
        for (let item of fileList.items) {
            promises.push(deleteObject(item))
        }
        deleteDoc(docRef);
        // setSuccesDelete('Успішно видалено');
        setTimeout(function () {
            // setSuccesModal(false);
        }, 2000)
        dataProduct();
    }
    return (
        <div className="offers-content">
            <table className="resp-tab">
                <thead>
                    <tr>
                        <th className='resp-one'>Фото</th>
                        <th className='resp-two'>Заголовок</th>
                        <th className='resp-two'>Розмір</th>
                        <th className='resp-two'>Ціна</th>
                        <th className='resp-two'>Видалити/Змінити</th>
                    </tr>
                </thead>
                <tbody>
                    {productList.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>
                                <span>Фото</span>
                                {item.image.length > 2 ?
                                    <img src={item.image[2]} alt='Фото товару' width={105} height={140} />
                                    :
                                    <img src={item.image[0]} alt='Фото товару' width={105} height={140} />
                                }
                            </td>
                            <td>
                                <span>Видалити/Заголовок</span>
                                {item.title}
                            </td>
                            <td>
                                <span>Розмір</span>
                                {item.size}
                            </td>
                            <td>
                                <span>Ціна</span>
                                {item.price}
                            </td>
                            <td>
                                <span>Видалити/Змінити</span>
                                <Image src={deletedBTN} alt="Кнопка видалити товар" onClick={() => handlerDeleteDoc(item.id)} style={{ cursor: 'pointer' }} />
                                <Image src={change} alt="Кнопка змінити товар" onClick={() => changeVisiblePopUp(item.id)} style={{ cursor: 'pointer', margin: '0 0 0 10px' }} width={27} height={27} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ChangeProductPopUp visible={visiblePopUp} handleClosePopUp={changeVisiblePopUp} productForChange={productForChange} dataProductFunc={dataProduct} />
        </div>
    )
}