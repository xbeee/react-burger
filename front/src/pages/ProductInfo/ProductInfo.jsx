import React from "react";
import "./ProductInfo.css"; // Подключаем файл со стилями
import { FaCheckCircle, FaUtensils, FaUserFriends, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductInfo = () => {
	return (
		<div className="container">
			<div className="roll-info">
				<h1 className="roll-info__title">Добро пожаловать в React Burger!</h1>
				<p className="roll-info__description">
					Мы рады приветствовать вас в нашем ресторане React Burger. Здесь вы найдете самые вкусные и качественные бургеры, приготовленные с любовью и из лучших ингредиентов.
				</p>
				<p className="roll-info__pickup-only">Пожалуйста, обратите внимание, что в настоящее время доступен только самовывоз. Доставка пока что недоступна.</p>
				<div className="roll-info__highlights">
					<h2 className="roll-info__highlight-title">Почему React Burger:</h2>
					<ul className="roll-info__highlight-list">
						<li className="roll-info__highlight-item">
							<FaUtensils
								className="icon"
								size={30}
							/>{" "}
							Широкий выбор вкусных бургеров
						</li>
						<li className="roll-info__highlight-item">
							<FaCheckCircle
								className="icon"
								size={30}
							/>{" "}
							Использование только свежих ингредиентов
						</li>
						<li className="roll-info__highlight-item">
							<FaClock
								className="icon"
								size={30}
							/>{" "}
							Быстрое и удобное оформление заказа
						</li>
					</ul>
				</div>
				<div className="roll-info__btn">
					<Link to="/">
						<button className="button">В каталог</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
