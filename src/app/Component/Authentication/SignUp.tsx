import { auth, dbreal } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import Image from 'next/image';
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import close from 'src/source/header/close.svg';
import { uid } from 'uid';


interface closePopUp {
    handlerClose: MouseEventHandler<HTMLImageElement> | any
}
export default function SignUp({ handlerClose }: closePopUp) {
    const [loginValue, setLoginValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [error, setError] = useState('');

    const handlerLoginValue = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginValue(e.target.value);
    }
    const handlerPassValue = (e: ChangeEvent<HTMLInputElement>) => {
        setPassValue(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!loginValue || !passValue) {
            setError('Потрібно заповнити всі поля');
        } else if (passValue.length < 6) {
            setError('Пароль має бути не меньше 6 символів');
        } else {
            const uiddd = uid();
            const db = getDatabase();
            createUserWithEmailAndPassword(auth, loginValue, passValue)
                .then(({ user }) => {
                    onValue(ref(db, `/users/${user.uid}`), (snapshot) => {
                        const data = snapshot.val();
                        const uidd = uid()
                        console.log(data)
                        set(ref(db, `/users/${user.uid}/${uiddd}`), {
                            first: '',
                            lastname: '',
                            surname: '',
                            email: loginValue,
                            role: 'Покупець',
                            delivery: {
                                city: '',
                                department: '',
                                number: '',
                                method: ''
                            },
                            offers: [{id: ''}],
                            uidd: uiddd,
                            uiduser: user.uid,
                        })
                    })
                    handlerClose();
                })
                .catch((err) => {
                    if (err.message === 'Firebase: Error (auth/invalid-email).') {
                        setError('Неправильно введено пошту');
                    } else if (err.message === `Firebase: Error (auth/wrong-password).` || `Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).`) {
                        setError('Пароль мінімум 6 символів');
                    } 
                     if (err.message === `Firebase: Error (auth/email-already-in-use).`) {
                        setError('Електронна пошта вже використовується');
                    }
                })
        }
    }
    return (
        <>
            <form>
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
                            <button className="login__button" onClick={handleSubmit}>Зареєструватися</button>
                        </div>
                    </div>
                </div>

            </form>
        </>
    )
}