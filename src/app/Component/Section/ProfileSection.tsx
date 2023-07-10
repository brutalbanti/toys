'use client'

import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import './profile.css';
import { auth, dbreal } from '@/app/utils/firebase';
import { onValue, ref, update } from 'firebase/database';
import { useRouter } from 'next/router';
import React from "react"
import InputMask from "react-input-mask";
import Offers from './Offer/Offers';
import Link from 'next/link';

export default function ProfileSection() {
    const [toggleTabs, setToggleTabs] = useState(1);
    const [profile, setProfile] = useState<any>({ first: '', lastname: '', role: '', surname: '', uidd: '', uiduser: '', email: '', delivery: { city: '', departament: '', method: '', number: '' } });
    const router = useRouter();
    const [succes, setSucces] = useState({ message: '', cheker: false });
    const [handleButton, setHandleButton] = useState<boolean>(false);

    useEffect(() => {
        auth.onAuthStateChanged((user: any) => {
            onValue(ref(dbreal, `/users/${user.uid}`), (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    Object.values(data).map((todo: any) => {
                        setProfile(todo)
                    })
                }
            })
        })
    }, []);

    const handlerFirst = (e: ChangeEvent<HTMLInputElement>) => {
        setProfile({ first: e.target.value, lastname: profile.lastname, surname: profile.surname, uidd: profile.uidd, uiduser: profile.uiduser, email: profile.email, delivery: { city: profile.delivery.city, departament: profile.delivery.departament, method: profile.delivery.method, number: profile.delivery.number } })
    }
    const handlerLastName = (e: ChangeEvent<HTMLInputElement>) => {
        setProfile({ first: profile.first, lastname: e.target.value, surname: profile.surname, uidd: profile.uidd, uiduser: profile.uiduser, email: profile.email, delivery: { city: profile.delivery.city, departament: profile.delivery.departament, method: profile.delivery.method, number: profile.delivery.number } })
    }
    const handlerSurName = (e: ChangeEvent<HTMLInputElement>) => {
        setProfile({ first: profile.first, lastname: profile.lastname, surname: e.target.value, uidd: profile.uidd, uiduser: profile.uiduser, email: profile.email, delivery: { city: profile.delivery.city, departament: profile.delivery.departament, method: profile.delivery.method, number: profile.delivery.number } })
    }
    const handlerNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setProfile({ first: profile.first, lastname: profile.lastname, surname: profile.surname, uidd: profile.uidd, uiduser: profile.uiduser, email: profile.email, delivery: { city: profile.delivery.city, departament: profile.delivery.departament, method: profile.delivery.method, number: e.target.value } })
    }

    const handlerToggleTabs = (index: number) => {
        setToggleTabs(index);
    }
    
    const handlerSubmit = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        auth.onAuthStateChanged((user: any) => {
            update(ref(dbreal, `/users/${user.uid}/${profile.uidd}`), {
                first: profile.first,
                lastname: profile.lastname,
                surname: profile.surname,
                email: profile.email,
                role: 'Покупець',
                delivery: {
                    city: '',
                    department: '',
                    number: profile.delivery.number,
                    method: ''
                },
                offers: [{ id: '' }],
                uidd: profile.uidd,
                uiduser: user.uid,
            })
            setSucces({ message: 'Успішно змінено', cheker: true })
            setTimeout(function () {
                setSucces({ message: '', cheker: false })
            }, 2000);
            setHandleButton(true);
            setTimeout(function () {
                setHandleButton(false)
            }, 10000);
        })
    }

    const signOunt = (e: any) => {
        e.preventDefault();
        auth.signOut();
        router.push('/')
    }

    return (
        <section className="page__profile">
            <div className="profile__container">
                <aside className="menu__profile-aside">
                    <h4 className="menu-profile__title">
                        ОСОБИСТИЙ КАБІНЕТ
                    </h4>
                    <ul className="menu-profile__list">
                        <li className={toggleTabs === 1 ? "menu-profile__item active" : "menu-profile__item"} onClick={() => handlerToggleTabs(1)}>ІНФОРМАЦІЯ</li>
                        <li className={toggleTabs === 2 ? "menu-profile__item active" : "menu-profile__item"} onClick={() => handlerToggleTabs(2)}>МОЇ ЗАМОВЛЕННЯ</li>
                        {profile.role === 'Адміністратор' &&
                            <li className="menu-profile__item admin"><Link href="/profile/admin">Адмін-панель</Link></li>
                        }
                        <li className="menu-profile__item" onClick={signOunt}>ВИЙТИ</li>
                    </ul>
                </aside>
                <div className="profile__content">
                    <div className="profile-content__information">
                        <form className={toggleTabs === 1 ? 'profile-form active' : 'profile-form'}>
                            <div className="input__item">
                                <label htmlFor="" className="input-item__label"></label>
                                <input type="text" className="input-item__input" placeholder="ІМ'Я" value={profile.first} onChange={(e) => handlerFirst(e)} />
                            </div>
                            <div className="input__item">
                                <label htmlFor="" className="input-item__label"></label>
                                <input type="text" className="input-item__input" placeholder="ФАМІЛІЯ" value={profile.lastname} onChange={(e) => handlerLastName(e)} />
                            </div>
                            <div className="input__item">
                                <label htmlFor="" className="input-item__label"></label>
                                <input type="text" className="input-item__input" placeholder="ПО-БАТЬКОВІ" value={profile.surname} onChange={(e) => handlerSurName(e)} />
                            </div>
                            <div className="input__item">
                                <label htmlFor="" className="input-item__label"></label>
                                <InputMask mask='+38(099)999-99-99' className="input-item__input" placeholder="ТЕЛЕФОН" value={profile.delivery.number} onChange={(e) => handlerNumber(e)} />
                            </div>
                            <div className="input__item">
                                <label htmlFor="" className="input-item__label"></label>
                                <input type="EMAIL" className="input-item__input" placeholder="ЕЛЕКТРОННА ПОШТА" value={profile.email} readOnly />
                            </div>
                            <button className="profile-btn__save" onClick={(e) => handlerSubmit(e)} disabled={handleButton}>ЗБЕРЕГТИ ЗМІНИ</button>
                        </form>
                    </div>
                    <div className={toggleTabs === 2 ? "profile-content__offers active" : "profile-content__offers"}>
                        <Offers />
                    </div>
                </div>
            </div>
            <div className={succes.cheker ? "message-succes active" : "message-succes"}>
                <p>{succes.message}</p>
            </div>
        </section>
    )
}