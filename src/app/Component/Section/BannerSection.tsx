import Image from "next/image";
import banner from 'src/source/main/banner.png'
import './banner.css'

export default function BannerSection() {
    return (
        <section className="page__banner">
            <div className="banner__container">
                <div className="banner-content">
                </div>
            </div>
        </section>
    )
}