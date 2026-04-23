import React from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ContentLoader from "react-content-loader";
import {BASE_URL} from "../constants";

export default function CartItem({ id, product_name, imageURL, product_type, product_size, quantity, price, updateCartTotal, product_id }) {
	const [quantityRoll, setQuantityRoll] = React.useState(quantity);
	const [isChange, setIsChange] = React.useState(false);
	const [totalPriceItem, setTotalPriceItem] = React.useState(price * quantity);
	const [snackbarOpen, setSnackbarOpen] = React.useState(false); // Добавляем состояние для отображения Snackbar
	const [snackbarMessage, setSnackbarMessage] = React.useState("");
	const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(false); // Добавляем состояние для отображения модального окна

	React.useEffect(() => {
		setTotalPriceItem(price * quantity);
	}, [price, quantity]);

	const debouncedHandleQuantityChange = async (change) => {
		const newQuantity = quantityRoll + change;
		setIsChange(true);
		if (newQuantity >= 1) {
			setQuantityRoll(newQuantity);
			setTotalPriceItem(newQuantity * price);

			await sendUpdateToServer({ quantity: newQuantity, price: price, productId: product_id, product_type: product_type, product_size: product_size });
			await updateCartTotal({ id, product_name, imageURL, product_type, product_size, quantity: newQuantity, price: price, productId: product_id });
			setIsChange(false);
		}
	};
	const sendUpdateToServer = async (updatedItem) => {
		try {
			await axios.put(`${BASE_URL}/api/updateCartItem`, updatedItem);
			// Успешно обновлено количество товара на сервере
		} catch (error) {
			console.error("Ошибка при изменении количества товара на сервере:", error);
			// Обработка ошибки при обновлении товара на сервере
			alert(`Ошибка при изменении количества товара на сервере. Пожалуйста, повторите попытку.`);
		}
	};

	const handleQuantityChange = (change) => {
		debouncedHandleQuantityChange(change);
	};

	const handleRemoveItem = async () => {
		setOpenConfirmationDialog(true); // Показываем модальное окно при удалении товара
	};
	const handleConfirmDelete = async () => {
		setOpenConfirmationDialog(false);
		const token = localStorage.getItem("token");
		try {
			await axios.delete(`${BASE_URL}/api/deleteCartItem/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			updateCartTotal(); // Обновляем корзину после удаления товара
			setSnackbarMessage(`Товар "${product_name}" удален из корзины`); // Устанавливаем сообщение для Snackbar
			setSnackbarOpen(true); // Открываем Snackbar
		} catch (error) {
			console.error("Ошибка при удалении товара из корзины:", error);
			// Ошибка при удалении товара
			// alert(`Ошибка при удалении товара из корзины. Пожалуйста, повторите попытку.`);
			setSnackbarMessage(`Ошибка удаления товара "${product_name}", повторите попытку`); // Устанавливаем сообщение для Snackbar
			setSnackbarOpen(true); // Открываем Snackbar
		}
	};
	const handleCancelDelete = () => {
		setOpenConfirmationDialog(false); // Закрываем модальное окно без удаления товара
	};
	const handleSnackbarClose = () => {
		setSnackbarOpen(false); // Закрываем Snackbar
	};
	return (
		<div className="cart__item">
			<div className="cart__item-img">
				<img
					className="roll-block__image"
					src={`${imageURL}`}
					alt={product_name}
				/>
			</div>
			<div className="cart__item-info">
				<h3>{product_name}</h3>

				<p>{`${product_size} `}</p>
			</div>
			<div className="cart__item-count">
				<button
					className="button button--outline button--circle cart__item-count-minus"
					onClick={() => handleQuantityChange(-1)}
					disabled={isChange || quantity === 1}
				>
					<svg
						width="10"
						height="10"
						viewBox="0 0 10 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
							fill="#EB5A1E"
						/>
						<path
							d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
							fill="#EB5A1E"
						/>
					</svg>
				</button>

				<b>{quantityRoll}</b>

				<button
					className="button button--outline button--circle cart__item-count-plus"
					onClick={() => handleQuantityChange(1)}
					disabled={isChange}
				>
					<svg
						width="10"
						height="10"
						viewBox="0 0 10 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
							fill="#EB5A1E"
						/>
						<path
							d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
							fill="#EB5A1E"
						/>
					</svg>
				</button>
			</div>
			<div className="cart__item-price">
				{isChange ? (
					<ContentLoader
						speed={0.2}
						width={150}
						height={30}
						viewBox="0 0 60 25"
						backgroundColor="#ededed"
						foregroundColor="#f97e0b"
					>
						<rect
							x="0"
							y="0"
							rx="14"
							ry="14"
							width="60"
							height="25"
						/>
					</ContentLoader>
				) : (
					<b>{`${totalPriceItem} ₽`}</b>
				)}
			</div>
			<div className="cart__item-remove">
				<div
					className="button button--outline button--circle"
					onClick={handleRemoveItem}
				>
					<svg
						width="10"
						height="10"
						viewBox="0 0 10 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
							fill="#EB5A1E"
						/>
						<path
							d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
							fill="#EB5A1E"
						/>
					</svg>
				</div>
			</div>
			<Dialog
				open={openConfirmationDialog}
				onClose={handleCancelDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Подтверждение удаления"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">Вы уверены, что хотите удалить товар "{product_name}" из корзины?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<button
						onClick={handleCancelDelete}
						className="button button--outline red"
					>
						Отмена
					</button>
					<button
						onClick={handleConfirmDelete}
						className="button button--outline green"
					>
						Удалить
					</button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleSnackbarClose}
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
		</div>
	);
}
