export default function HeaderSearch() { 
    return (
        <div className="search__content">
            <input type="text" className="search__input" autoComplete="off" placeholder="Введіть, що ви шукаєте"/>
            <button className="search__button">В пошук</button>
        </div>
    )
}