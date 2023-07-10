import Image from 'next/image';
import close from 'src/source/header/close.svg';
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, dbreal } from '@/app/utils/firebase';
import { onValue, ref } from 'firebase/database';


interface closePopUp {
    handlerClose: MouseEventHandler<HTMLImageElement> | any
}
export default function Login({ handlerClose }: closePopUp) {
    const [loginValue, setLoginValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [error, setError] = useState('');

    const handlerLoginValue = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginValue(e.target.value);
    }
    const handlerPassValue = (e: ChangeEvent<HTMLInputElement>) => {
        setPassValue(e.target.value);
    }

    const handleSubmit = () => {
        if (!loginValue || !passValue) {
            setError('Потрібно заповнити всі поля')
        } else {
            signInWithEmailAndPassword(auth, loginValue, passValue)
                .then(() => {
                    auth.onAuthStateChanged((user: any) => {
                        onValue(ref(dbreal, `/users/${user.uid}`), (snapshot) => {
                            const data = snapshot.val();
                        })
                        handlerClose();
                    })
                })
                .catch((err) => {
                    if (err.message === 'Firebase: Error (auth/invalid-email).') {
                        setError('Неправильно введено пошту');
                    } else if (err.message === `Firebase: Error (auth/wrong-password).` || `Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).`) {
                        setError('Неправильний пароль або такого аккаунту не існує ');
                    }

                })
        }
    }

    return (
        <div className="login-section">
            <Image src={close} alt='close-button-popup' className='close-popup-btn' width={20} height={20} onClick={handlerClose} />
            <div className="login-content">
                <div className="input-component">
                    <label htmlFor="">Електронна пошта</label>
                    <input type="email" className="login__input" autoComplete="off" placeholder="Введіть електронну пошту" value={loginValue} onChange={(e) => handlerLoginValue(e)} />
                </div>
                <div className="input-component">
                    <label htmlFor="">Пароль</label>
                    <input type="password" className="login__input" autoComplete="off" placeholder="Введіть пароль" value={passValue} onChange={(e) => handlerPassValue(e)} />
                </div>
                <div className="error-message-login">
                    {error}
                </div>
                <div className="button-block">
                    <button className="login__button" onClick={handleSubmit}>Увійти</button>
                </div>
            </div>
        </div>
    )
}