import './offer.css'

export default function Offers() {
    return (
        <div className="offers-content">
            <table className="resp-tab">
                <thead>
                    <tr>
                        <th className='resp-one'>Інформація про замовлення</th>
                        <th className='resp-two'>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p className='number-offer'>№77466782</p>
                            <p className='text-offer'>Покупець: <b>Антон Солов&lsquo;янов</b></p>
                            <p className='text-offer'>Кількість товарів: <b>1</b></p>
                            <p className='text-offer'>Дата замовлення: <b>08.06.2023</b></p>
                            <p className='text-offer'>ТТН: <b>20450723849111</b></p>
                        </td>
                        <td>
                            <b>200 грн</b>
                            <p>Виконано</p>
                        </td>
                    </tr>
                    <tr>
                        <td><span>Заголовок 1</span>Контент 5</td>
                        <td><span>Заголовок 2</span>Контент 5</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
} 