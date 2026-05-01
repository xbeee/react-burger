import React from "react";
import Categories from "../components/Categories";
import SortPopup from "../components/SortPopup";
import axios from "axios";
import {BASE_URL} from "../constants";
import ProductItem from "../components/ProductItem";

export default function Main() {
    const [roll, setRoll] = React.useState([]);
    const [rollCart, setRollCart] = React.useState([]);
    const [selectedCategories, setSelectedCategories] = React.useState([]); // Теперь массив выбранных категорий
    const [sortBy, setSortBy] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [availableCategories, setAvailableCategories] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const rollsResponse = await axios.get(`${BASE_URL}/api/rolls`);

                setRoll(rollsResponse.data);

                // Собираем все уникальные категории из всех роллов
                const allCategories = new Set();
                rollsResponse.data.forEach(item => {
                    item.category.forEach(cat => allCategories.add(cat));
                });
                setAvailableCategories(Array.from(allCategories));

                if (token) {
                    const cartResponse = await axios.get(`${BASE_URL}/api/getCart`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setRollCart(cartResponse.data.user_cart || []);
                }
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const sortedRoll = React.useMemo(() => {
        const sortFunctions = {
            popular: (a, b) => b.rating - a.rating,
            price_asc: (a, b) => a.price - b.price,
            price_desc: (a, b) => b.price - a.price,
            alphabet: (a, b) => a.name.localeCompare(b.name),
        };

        let sorted = [...roll];

        // Фильтрация по выбранным категориям
        if (selectedCategories.length > 0) {
            sorted = sorted.filter((item) => 
                selectedCategories.every(cat => item.category.includes(cat))
            );
        }

        // Сортировка
        if (sortBy && sortFunctions[sortBy]) {
            sorted.sort(sortFunctions[sortBy]);
        }

        return sorted;
    }, [sortBy, roll, selectedCategories]);

    const onSelectSortType = (type) => {
        setSortBy(type);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    return (
        <div className="container">
            <div className="content__top">
                <Categories
                    selectedCategories={selectedCategories}
                    onCategoryClick={handleCategoryClick}
                    categories={availableCategories}
                />
                <SortPopup onSelectSortType={onSelectSortType} />
            </div>
            <h2 className="content__title">Все бургеры</h2>
            {isLoading ? (
                <div className="loaderContainer">
                    <span className="loader"></span>
                </div>
            ) : (
                <div className="content__items">
                    {sortedRoll.map((obj) => (
                        <ProductItem
                            key={obj.id}
                            rollCart={rollCart}
                            {...obj}
                        />
                    ))}
                    {
                        (!isLoading && !sortedRoll?.length) && (
                            <p className="content__items-empty">Ничего не найдено!</p>
                        )
                    }
                </div>
            )}
        </div>
    );
}