import Image from 'next/image'
import './basket.css'
import { ChangeEvent, useEffect, useState } from 'react';
import deletedBTN from 'src/source/main/delete.svg';
import Link from 'next/link';
import { API_URL, API_KEY } from '../../../../../constants';
import { auth, dbreal } from '@/app/utils/firebase';
import { onValue, ref } from 'firebase/database';
import InputMask from "react-input-mask";


interface FuncInt {
    totalBasketFunc: any,
    countBasket: number
}
export default function BasketSection({ totalBasketFunc, countBasket }: FuncInt) {
    const [localGoods, setLocalGoods] = useState<any>(false);
    const [valueDataUser, setValueDataUser] = useState({ first: '', surname: '', lastname: '', delivery: { number: '' } });
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [postOffices, setPostOffices] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        allProductLocal();
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid)
                onValue(ref(dbreal, `/users/${user.uid}`), (snapshot) => {
                    const data = snapshot.val();
                    Object.values(data).map((todo: any) => {
                        setValueDataUser(todo);
                    })
                })
            } else {
                return
            }
        })
    }, [countBasket])

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        modelName: 'Address',
                        calledMethod: 'getAreas',
                        methodProperties: {},
                        apiKey: `${API_KEY}`, // Замініть на свій ключ доступу
                    }),
                });

                const data = await response.json();
                setRegions(data.data);
            } catch (error) {
                console.error('Помилка при отриманні даних з API:', error);
            }
        };

        fetchRegions();
    }, []);

    const handleRegionChange = (event: any) => {
        const selectedRegion = event.target.value;
        setSelectedRegion(selectedRegion);
        setSelectedCity('');
        setCities([]);
        setPostOffices([]);
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        modelName: 'Address',
                        calledMethod: 'getCities',
                        methodProperties: {
                            Area: selectedRegion,
                            Language: 'ua',
                        },
                        apiKey: `${API_KEY}`, // Замініть на свій ключ доступу
                    }),
                });

                const data = await response.json();
                setCities(data.data);
            } catch (error) {
                console.error('Помилка при отриманні даних з API:', error);
            }
        };

        if (selectedRegion) {
            fetchCities();
        }
    }, [selectedRegion]);

    const handleCityChange = (event: any) => {
        const selectedCity = event.target.value
        setSelectedCity(selectedCity);
    };

    useEffect(() => {
        const fetchPostOffices = async () => {
            try {
                const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        modelName: 'Address',
                        calledMethod: 'getWarehouses',
                        methodProperties: {
                            CityRef: selectedCity,
                            Language: 'ua',
                        },
                        apiKey: `${API_KEY}`, // Замініть на свій ключ доступу
                    }),
                });

                const data = await response.json();
                setPostOffices(data.data);
            } catch (error) {
                console.error('Помилка при отриманні даних з API:', error);
            }
        };

        if (selectedCity) {
            fetchPostOffices();
        }
    }, [selectedCity]);

    const allProductLocal = () => {
        if (localStorage.getItem('basket')) {
            const localBasket: any = localStorage.getItem('basket');
            const parseBasketData = JSON.parse(localBasket);
            setLocalGoods(parseBasketData);
            if (parseBasketData.length === 0) {
                localStorage.removeItem('basket');
                setLocalGoods(false)
            }
        }

    }
    const deleteProductBasket = (idx: number) => {
        const localProduct: any = localStorage.getItem('basket');
        const parseLocalProductFilter = JSON.parse(localProduct).filter((item: any, index: number) => idx !== index);
        localStorage.setItem('basket', JSON.stringify(parseLocalProductFilter));
        setLocalGoods(parseLocalProductFilter);
        totalBasketFunc();
        allProductLocal();
    }

    const handlerValueFirst = (e: ChangeEvent<HTMLInputElement>) => {
        setValueDataUser({ first: e.target.value, surname: valueDataUser.surname, lastname: valueDataUser.lastname, delivery: { number: valueDataUser.delivery.number } })
    }
    const handlerValueSurname = (e: ChangeEvent<HTMLInputElement>) => {
        setValueDataUser({ first: valueDataUser.first, surname: e.target.value, lastname: valueDataUser.lastname, delivery: { number: valueDataUser.delivery.number } })
    }
    const handlerValueLastname = (e: ChangeEvent<HTMLInputElement>) => {
        setValueDataUser({ first: valueDataUser.first, surname: valueDataUser.surname, lastname: e.target.value, delivery: { number: valueDataUser.delivery.number } })
    }
    const handlerValueNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setValueDataUser({ first: valueDataUser.first, surname: valueDataUser.surname, lastname: valueDataUser.lastname, delivery: { number: e.target.value } })
    }

    
    console.log(valueDataUser)

    useEffect(() => {
        const filteredCities = cities.filter((city: any) =>
            city.Description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredCities(filteredCities);
    }, [searchText, cities]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleOrderSubmit = async (event: any) => {
        event.preventDefault();
        const firstName = valueDataUser.first;
        const phoneNumber = valueDataUser.delivery.number;
        const lastName = valueDataUser.lastname; 
        const middleName = valueDataUser.surname; 
        // Отправка данных заказа на сервер
        const data = {
          localGoods,
          phoneNumber,
          firstName,
          lastName,
          middleName,
          regions,
          cities,
          postOffices,
        };
    
        const response = await fetch('/api/sendOrder.php', {
          method: 'POST',
          body: JSON.stringify(data),
        });
    
        const result = await response.text();
        console.log(result); // Обработка ответа сервера
      };
    

    return (
        <section className="page__basket">
            <div className="basket__container">
                <div className="basket-sec__title">КОШИК</div>
                <div className="basket-sec__content">
                    <div className="basket-sec__items">
                        {localGoods === false ?
                            <p className="basket-content__zero">
                                КОШИК ПОРОЖНІЙ
                            </p>
                            :
                            localGoods.map((item: any, idx: number) => (
                                <div className="basket-content__item" key={idx}>
                                    <div className="item-content__left">
                                        <img src={item.image[0]} alt="" width={95} height={130} />
                                        <div className="basket-item__name sec">
                                            <p>{item.title}</p>
                                            <p className="basket-item__price sec">
                                                Ціна
                                                <span>{item.price}₴</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Image src={deletedBTN} alt="Видалити товар з корзини" className="basket-item__delete" onClick={() => deleteProductBasket(idx)} />
                                </div>
                            ))
                        }
                    </div>

                    {localGoods !== false &&
                        <>
                            <form action="" className="basket-form">
                                <div className="basket-form__data-user">
                                    <label htmlFor="" className="data-user-form__label">
                                        Ім&apos;я
                                        <input type="text" className="data-user-form__input" placeholder="Ім'я" value={valueDataUser.first} onChange={(e) => handlerValueFirst(e)} />
                                    </label>
                                    <label htmlFor="" className="data-user-form__label">
                                        Фамілія
                                        <input type="text" className="data-user-form__input" placeholder="Фамілія" value={valueDataUser.lastname} onChange={(e) => handlerValueLastname(e)} />
                                    </label>
                                    <label htmlFor="" className="data-user-form__label">
                                        По-батькові
                                        <input type="text" className="data-user-form__input" placeholder="По-батькові" value={valueDataUser.surname} onChange={(e) => handlerValueSurname(e)} />
                                    </label>
                                    <label htmlFor="" className="data-user-form__label">
                                        Номер телефону
                                        <InputMask mask='+38(099)999-99-99' className="data-user-form__input" placeholder="Телефон" value={valueDataUser.delivery.number} onChange={(e) => handlerValueNumber(e)} />
                                    </label>
                                </div>
                                <div className='basket__nova-pochta'>
                                    <label>
                                        Область:
                                        <select onChange={handleRegionChange}>
                                            <option value="">Оберіть область</option>
                                            {regions.map((region: any) => (
                                                <option key={region.Ref} value={region.Ref}>
                                                    {region.Description}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label>
                                        Місто:
                                        <div className="wrapper-select">
                                            <select onChange={handleCityChange}>
                                                <option value="">Оберіть місто</option>
                                                {filteredCities.map((city: any) => (
                                                    <option key={city.Ref} value={city.Ref}>
                                                        {city.Description}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                id="cityInput"
                                                placeholder="Введіть назву міста"
                                                value={searchText}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </label>

                                    <label>
                                        Відділення/Почтомат:
                                        <select>
                                            <option value="">Оберіть відділення/почтомат</option>
                                            {postOffices.map((office: any) => (
                                                <option key={office.Ref} value={office.Ref}>
                                                    {office.Description}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </form>
                            <div className="basket-content__total-amount sec">
                                ЗАГАЛЬНА СУМА
                                <span>{countBasket}₴</span>
                            </div>
                            <div className="basket-button__block sec">
                                <button className="basket-content__button" onClick={handleOrderSubmit}>ОФОРМИТИ ЗАМОВЛЕННЯ</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </section >
    )
}