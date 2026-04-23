import React from "react";

export default function SortPopup({ onSelectSortType }) {
	const sortItems = [
		{ value: "popular", name: "популярности" },
		{ value: "price_desc", name: "по убыванию цены" },
		{ value: "price_asc", name: "по возрастанию цены" },
		{ value: "alphabet", name: "алфавиту" },
	];

	const handleSelectItem = (value) => {
		setActiveSortType(value); // Обновляем состояние активного типа сортировки
		if (onSelectSortType) {
			onSelectSortType(value); // Вызов функции выбора сортировки с переданным значением
		}
		setVisiblePopup(false); // Скрытие выпадающего списка после выбора
	};

	const [visiblePopup, setVisiblePopup] = React.useState(false); // Состояние видимости выпадающего списка
	const [activeSortType, setActiveSortType] = React.useState("popular"); // Состояние активного типа сортировки

	const toggleVisiblePopup = () => {
		setVisiblePopup(!visiblePopup);
	};

	return (
		<div className="sort">
			<div
				className="sort__label"
				onClick={toggleVisiblePopup}
			>
				<svg
					width="10"
					height="6"
					viewBox="0 0 10 6"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
						fill="#2C2C2C"
					/>
				</svg>
				<b style={{color: "black"}}>Сортировка по:</b>
				<span>{sortItems.find((item) => item.value === activeSortType)?.name}</span>
			</div>
			{visiblePopup && (
				<div className="sort__popup">
					<ul>
						{sortItems.map((item, index) => (
							<li
								key={`${item}_${index}`}
								onClick={() => handleSelectItem(item.value)}
								className={activeSortType === item.value ? "active" : ""}
							>
								{item.name}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
