'use client'
import { use, useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import './login.css';
import { MouseEventHandler } from 'react';


interface auth {
    handlePopUp: boolean,
    handlerClose: MouseEventHandler<HTMLImageElement> | undefined
}
export default function Authentication({ handlePopUp, handlerClose }: auth) {
    const [tabsClick, setTabsClick] = useState(false);
    const handlerTabsLogIn = () => {
        setTabsClick(false);
    }
    const handlerTabsSignUp = () => {
        setTabsClick(true);
    }

    return (
        <div className={handlePopUp ? "authentication__section active" : "authentication__section"}>
            <div className={handlePopUp ? "authentication__content active" : "authentication__content"}>
                <div className="tabs-login">
                    <button className={tabsClick ? "tabs-button-login in" : "tabs-button-login in active"} onClick={handlerTabsLogIn}>Увійти</button>
                    <button className={tabsClick ? "tabs-button-login up active" : "tabs-button-login up"} onClick={handlerTabsSignUp}>Зареєструватися</button>
                </div>
                {tabsClick ?
                    <SignUp handlerClose={handlerClose} />
                    :
                    <Login handlerClose={handlerClose} />
                }
            </div>
        </div>
    )
}