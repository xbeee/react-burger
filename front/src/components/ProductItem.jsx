import React, { useState } from "react";
import classNames from "classnames";
import axios from "axios";
import Button from "./Button";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../constants";

export default function ProductItem({ id, name, imageURL, price, sizes, rollCart }) {
	const [quantity, setQuantity] = useState(1);
	const [isInCart, setIsInCart] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [error, setError] = useState(false);
	const [loggedError, setLoggedError] = useState(false);

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const incrementQuantity = () => {
		setQuantity(quantity + 1);
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleAddToCart = async () => {
		try {
			const token = localStorage.getItem("token");
			const totalPriceIt = price * quantity;

			await axios.post(
				`${BASE_URL}/api/addCart`,
				{
					product_id: id,
					quantity: quantity,
					product_name: name,
					imageURL: imageURL,
					price: totalPriceIt,
					product_size: sizes[0], // просто строка
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSnackbarMessage(`Товар "${name}" добавлена в корзину`);
			setSnackbarOpen(true);
			setIsInCart(true);
		} catch (error) {
			console.error("Ошибка:", error);
			setLoggedError(true);
		}
	};

	React.useEffect(() => {
		setIsInCart(rollCart.some((item) => item.product_name === name));
	}, [ name, rollCart]);

	return (
		<div className="roll-block">
			<img
				className="roll-block__image"
				src={`${imageURL}`}
				alt="Roll"
			/>
			<h4 className="roll-block__title">{name}</h4>
			{/*<div className="roll-block__selector">*/}
			{/*	<ul>*/}
			{/*		{availableSizes.map((size, index) => (*/}
			{/*			<li*/}
			{/*				key={size}*/}
			{/*				onClick={() => onSelectSize(index)}*/}
			{/*				className={classNames({*/}
			{/*					active: activeSize === index,*/}
			{/*					disabled: !sizes.includes(size),*/}
			{/*				})}*/}
			{/*			>*/}
			{/*				{size}*/}
			{/*			</li>*/}
			{/*		))}*/}
			{/*	</ul>*/}
			{/*</div>*/}
			<div className="roll-block__bottom">
				{!isInCart ? (
					<>
						<div className={'roll-block__info'}>
							<div className="roll-block__price">
								{price * quantity} ₽
							</div>
							<span>{sizes}</span>
						</div>
						<div className="roll-block__quantity">
							<Button
								className="counter"
								outline
								onClick={decrementQuantity}
							>
								-
							</Button>
							<span className="quantity-value">{quantity}</span>
							<Button
								className="counter"
								outline
								onClick={incrementQuantity}
							>
								+
							</Button>
						</div>
						<Button
							className="button--add"
							onClick={handleAddToCart}
							// disabled={activeSize === null}
							// title={activeSize === null && 'Выберите массу товара'}
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
									fill="white"
								/>
							</svg>
							<span>Добавить</span>
						</Button>
					</>
				) : (
					<Button className="button--added">
						<Link
							to="/cart"
							className="link"
						>
							<svg
								width="25"
								height="23"
								viewBox="0 0 18 18"
								fill="#f24701"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z"
									stroke="#f24701"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z"
									stroke="#f24701"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669"
									stroke="#f24701"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>В корзине</span>
						</Link>
					</Button>
				)}
			</div>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleSnackbarClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleSnackbarClose}
					severity="success"
				>
					Товар "{name}" добавлена в корзину
				</MuiAlert>
			</Snackbar>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleSnackbarClose}
					severity="success"
				>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
			<Snackbar
				open={error}
				autoHideDuration={1500} // Время, через которое Snackbar исчезнет (мс)
				onClose={() => setError(false)} // Обработчик закрытия Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Позиция Snackbar
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					severity="error"
					onClose={() => setError(false)} // Обработчик закрытия Alert
				>
					Сначала выберите массу товара
				</MuiAlert>
			</Snackbar>
			<Snackbar
				open={loggedError}
				autoHideDuration={1500} // Время, через которое Snackbar исчезнет (мс)
				onClose={() => setLoggedError(false)} // Обработчик закрытия Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Позиция Snackbar
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					severity="error"
					onClose={() => setLoggedError(false)} // Обработчик закрытия Alert
				>
					Пожалуйста, авторизуйтесь
				</MuiAlert>
			</Snackbar>
		</div>
	);
}
