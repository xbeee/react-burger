import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderItem from "../../components/OrderItem";
import "./_Order.scss";
import cartEmp from "../../assets/img/empty-cart.png";
import { Link } from "react-router-dom";
import {BASE_URL} from "../../constants";

export default function Order() {
	const [userOrders, setUserOrders] = useState({});

	useEffect(() => {
		async function fetchOrders() {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${BASE_URL}/api/userOrders`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUserOrders(response.data.orders || {}); // Проверяем наличие заказов и устанавливаем их или пустой объект
			} catch (error) {
				console.error("Ошибка при получении заказов:", error);
			}
		}

		fetchOrders();
	}, []);

	const calculateTotal = (order) => {
		let totalQuantity = 0;
		let totalPrice = 0;
		order.forEach((item) => {
			totalQuantity += item.quantity;
			totalPrice += item.price;
		});
		return { totalQuantity, totalPrice };
	};

	const handleDeleteOrder = async (orderId) => {
		try {
			await axios.delete(`${BASE_URL}/api/deleteOrder/${orderId}`);
			console.log("Удалил");
			setUserOrders((prevOrders) => {
				const updatedOrders = { ...prevOrders };
				delete updatedOrders[orderId];
				return updatedOrders;
			});
		} catch (error) {
			console.log("Неудалил");
		}
	};

	return (
		<div className="container">
			{Object.keys(userOrders).map((orderId, index) => (
				<div
					key={orderId}
					className="order"
				>
					<h3>Заказ: №{index + 1}</h3>
					<div className="order-details">
						{userOrders[orderId].map((item, index) => (
							<OrderItem
								key={index}
								{...item}
							/>
						))}
					</div>
					<div className="order-summary">
						<div className="order-summry__btn">
							<p>Общее количество: {calculateTotal(userOrders[orderId]).totalQuantity}</p>
							<p>Общая сумма: {calculateTotal(userOrders[orderId]).totalPrice} ₽</p>
							<p>
								Статус: <b>самовывоз</b>, г. Уфа, улица Чернышевского 141
							</p>
						</div>
						<button onClick={() => handleDeleteOrder(orderId)}>Удалить заказ</button>
					</div>
				</div>
			))}
			{/* Если нет заказов, выводим блок с информацией о пустой корзине */}
			{Object.keys(userOrders).length === 0 && (
				<div className="cart cart--empty">
					<h2>
						Заказов нет <icon>😕</icon>
					</h2>
					<p>
						Вероятней всего, вы не оформляли заказы роллов.
						<br />
						Для того, чтобы заказать роллы, перейдите на главную страницу.
					</p>
					<img
						src={cartEmp}
						alt="Empty cart"
					/>
					<Link
						to="/"
						className="button button--black"
					>
						<span>На главную</span>
					</Link>
				</div>
			)}
		</div>
	);
}
