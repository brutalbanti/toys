import Link from 'next/link'
import './footer.css'
import Image from 'next/image'
import inst from 'src/source/footer/instagram.svg';
import logo from 'src/source/header/logo2.png';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__left">
                    <a href="" className="footer-left__logo"><Image src={logo} alt='Лого магазину' width={70} height={70}/></a>
                    <ul className="footer-left__list">
                        <li className="left-footer__item-list">
                            <Link href=''>
                                Весь каталог
                            </Link>
                        </li>
                        <li className="left-footer__item-list">
                            <Link href=''>
                                Блог
                            </Link>
                        </li>
                        <li className="left-footer__item-list">
                            <Link href=''>
                                Про нас
                            </Link>
                        </li>
                        <li className="left-footer__item-list">
                            <Link href=''>
                                Доставка та оплата
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="footer__right">
                    <ul className="footer-right__list">
                        <li className="right-footer__item-list">
                            <Link href=''>
                                Користувальницька угода
                            </Link>
                        </li>
                        <li className="right-footer__item-list">
                            <Link href=''>
                                Політика конфіденційності
                            </Link>
                        </li>
                    </ul>
                    <div className="footer-right__social">
                        <Link href=''><Image src={inst} alt='Лого інстаграм' className='social-icon' /></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}