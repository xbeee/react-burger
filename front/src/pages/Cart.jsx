import React from "react";
import { Link } from "react-router-dom";
import cartEmp from "../assets/img/empty-cart.png";
import CartItem from "../components/CartItem";
import axios from "axios";
import ContentLoader from "react-content-loader";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import greenCheckmark from "../assets/img/complete-order.jpg";
import {BASE_URL} from "../constants";
// import arrow from "../assets/img/arrow.png";

const useStyles = makeStyles((theme) => ({
	cancelButton: {
		backgroundColor: "#ff0000", // Красный цвет для кнопки "Отмена"
		color: "#fff", // Белый цвет текста
		"&:hover": {
			backgroundColor: "#cc0000", // Цвет кнопки при наведении
		},
	},
	confirmButton: {
		backgroundColor: "#00ff00", // Зеленый цвет для кнопки "Да"
		color: "#fff", // Белый цвет текста
		"&:hover": {
			backgroundColor: "#00cc00", // Цвет кнопки при наведении
		},
	},
}));

export default function Cart() {
	const [cartItems, setCartItems] = React.useState([]);
	const [totalQuantity, setTotalQuantity] = React.useState(0);
	const [totalPrice, setTotalPrice] = React.useState(0);
	const [isChange, setIsChange] = React.useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [orderStatus, setOrderStatus] = React.useState(null);
	const [orderId, setOrderId] = React.useState(null);

	React.useEffect(() => {
		setIsChange(true);
		let newTotalQuantity = 0;
		let newTotalPrice = 0;
		cartItems.forEach((item) => {
			newTotalQuantity += item.quantity;
			newTotalPrice += item.quantity * item.price;
		});
		setTotalQuantity(newTotalQuantity);
		setTotalPrice(newTotalPrice);
		setIsChange(false);
	}, [cartItems]);

	React.useEffect(() => {
		setIsChange(true);
		setIsLoading(true);
		// Получение данных корзины с сервера
		const fetchCartItems = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await axios.get(`${BASE_URL}/api/getCart`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				// console.log("Изменен");
				const { user_cart } = response.data;
				setCartItems(user_cart);
				calculateTotal(user_cart);
			} catch (error) {
				console.error("Ошибка при получении данных корзины:", error);
			} finally {
				setIsLoading(false); // Скрыть loader после завершения загрузки, включая случаи ошибки
			}
			setIsChange(false);
		};

		fetchCartItems();
		setIsChange(false);
	}, []);

	const handleConfirmDialogOpen = () => {
		setConfirmDialogOpen(true);
	};

	const handleConfirmDialogClose = () => {
		setConfirmDialogOpen(false);
	};

	const clearCart = async () => {
		handleConfirmDialogClose();
		try {
			const token = localStorage.getItem("token");
			await axios.delete(`${BASE_URL}/api/clearCart`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Обновляем состояние корзины после успешного удаления
			updateCartTotal();
		} catch (error) {
			console.error("Ошибка при очистке корзины:", error);
		}
	};
	const fetchCartItems = async () => {
		const token = localStorage.getItem("token");
		try {
			const response = await axios.get(`${BASE_URL}/api/getCart`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { user_cart } = response.data;
			setCartItems(user_cart);
			calculateTotal(user_cart);
		} catch (error) {
			console.error("Ошибка при получении данных корзины:", error);
		}
	};

	const updateCartTotal = async () => {
		setIsChange(true);
		await fetchCartItems();
		setIsChange(false);
	};
	const calculateTotal = (cartItems) => {
		setIsChange(true);
		let quantity = 0;
		let price = 0;

		cartItems.forEach((item) => {
			quantity += item.quantity;
			price += item.price; // Предполагается, что в объекте item есть свойство price
		});

		setTotalQuantity(quantity);
		setTotalPrice(price);
		// setCartTotal({ quantity: totalQuantity, totalPrice: totalPrice });
		setIsChange(false);
	};
	const placeOrder = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(`${BASE_URL}/api/addOrder`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setOrderStatus("success");
			setOrderId(response.data.order_id);
			// После успешного оформления заказа можно добавить дополнительные действия, если необходимо
		} catch (error) {
			console.error("Ошибка при оформлении заказа:", error);
			setOrderStatus("error");
		}
	};
	// Создаем стили с помощью makeStyles
	const classes = useStyles();
	return (
		<>
			{orderStatus === "success" ? (
				<div className="container container--cart">
					<div className="order-success">
						<img
							src={greenCheckmark}
							alt="Заказ оформлен"
						/>
						<p>
							Ваш заказ успешено оформлен оформлен! <br /> <span>Вы можете перейти на страницу заказов или продолжить покупки.</span>
						</p>
						<Link to="/">
							<button className="button button--order">Вернуться на главную</button>
						</Link>
						<Link to="/orders">
							<button className="button button--outline button--order">Перейти к заказам</button>
						</Link>
					</div>
				</div>
			) : orderStatus === "error" ? (
				<div className="order-error">
					<p>Произошла ошибка при оформлении заказа. Попробуйте еще раз.</p>
				</div>
			) : (
				<>
					{!isLoading ? (
						<div className="container container--cart">
							{cartItems.length > 0 ? (
								<div className="cart">
									<div className="cart__top">
										<h2 className="content__title">
											<svg
												width="18"
												height="18"
												viewBox="0 0 18 18"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z"
													stroke="white"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z"
													stroke="white"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669"
													stroke="white"
													strokeWidth="1.8"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
											Корзина
										</h2>
										<div
											className="cart__clear"
											onClick={handleConfirmDialogOpen}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M2.5 5H4.16667H17.5"
													stroke="#B6B6B6"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M6.66663 5.00001V3.33334C6.66663 2.89131 6.84222 2.46739 7.15478 2.15483C7.46734 1.84227 7.89127 1.66667 8.33329 1.66667H11.6666C12.1087 1.66667 12.5326 1.84227 12.8451 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M15.8333 5.00001V16.6667C15.8333 17.1087 15.6577 17.5326 15.3451 17.8452C15.0326 18.1577 14.6087 18.3333 14.1666 18.3333H5.83329C5.39127 18.3333 4.96734 18.1577 4.65478 17.8452C4.34222 17.5326 4.16663 17.1087 4.16663 16.6667V5.00001H15.8333Z"
													stroke="#B6B6B6"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M8.33337 9.16667V14.1667"
													stroke="#B6B6B6"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
												<path
													d="M11.6666 9.16667V14.1667"
													stroke="#B6B6B6"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
											<span>Очистить корзину</span>
										</div>
									</div>

									<div className="content__items">
										{cartItems.map((item) => (
											<CartItem
												key={item.product_id}
												{...item}
												updateCartTotal={updateCartTotal}
											/>
										))}
									</div>
									<div className="cart__bottom">
										<div className="cart__bottom-details">
											<span>
												Всего товаров: <b>{totalQuantity} шт.</b>
											</span>
											<span className="cartTotal">
												Сумма заказа:
												{isChange ? (
													<ContentLoader
														speed={0.2}
														width={60}
														height={31}
														viewBox="0 0 60 31"
														backgroundColor="#ededed"
														foregroundColor="#f97e0b"
													>
														<rect
															x="0"
															y="0"
															rx="14"
															ry="14"
															width="60"
															height="31"
														/>
													</ContentLoader>
												) : (
													<b>{totalPrice} ₽</b>
												)}
											</span>
										</div>
										<div className="cart__bottom-buttons">
											<Link
												to="/"
												className="button button--outline button--add go-back-btn"
											>
												<svg
													width="8"
													height="14"
													viewBox="0 0 8 14"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M7 13L1 6.93015L6.86175 1"
														stroke="#D3D3D3"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>

												<span>Вернуться назад</span>
											</Link>
											<div
												className="button pay-btn"
												onClick={placeOrder}
											>
												<span>Оформить заказ</span>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="cart cart--empty">
									<h2>
										Корзина пустая <icon>😕</icon>
									</h2>
									<p>
										Вероятней всего, вы не заказывали ещё ничего.
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
										<span>Вернуться назад</span>
									</Link>
								</div>
							)}
							<Dialog
								open={confirmDialogOpen}
								onClose={handleConfirmDialogClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">{"Подтвердите удаление"}</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">Вы уверены, что хотите очистить корзину?</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={handleConfirmDialogClose}
										className={classes.cancelButton}
									>
										Отмена
									</Button>
									<Button
										onClick={clearCart}
										className={classes.confirmButton}
										autoFocus
									>
										Да
									</Button>
								</DialogActions>
							</Dialog>
						</div>
					) : (
						<div className="loaderContainer">
							<span className="loader"></span>
						</div>
					)}
				</>
			)}
		</>
	);
}
