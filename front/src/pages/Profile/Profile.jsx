import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";
// import stylesModal from "./Modal.module.scss";
import placeholderImage from "../../assets/img/profile.png";
// import TextField from "@mui/material/TextField";
import { Alert, Snackbar } from "@mui/material";
import InputMask from "react-input-mask";
import {BASE_URL} from "../../constants";
// import Modal from "../../components/Modal";
// import Button from "../../components/Button";

export default function Profile() {
	const [userData, setUserData] = useState({
		Fsp: "",
		email: "",
		number: "",
	});
	const [initialUserData, setinitialUserData] = useState({
		Fsp: "",
		email: "",
		number: "",
	});

	const [isEditing, setIsEditing] = useState(false);
	const [edited, setEdited] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	// const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // Состояние модального окна для изменения пароля
	// const [newPassword, setNewPassword] = useState("");
	const [successMessageOpen, setSuccessMessageOpen] = useState(false);

	React.useEffect(() => {
		// Получение данных пользователя при монтировании компонента
		const token = localStorage.getItem("token");

		axios
			.get(`${BASE_URL}/api/getUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setUserData(response.data);
				setinitialUserData(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Ошибка при получении данных пользователя:", error);
			});
	}, []);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
		setErrors({ ...errors, [name]: "" });
		
	};
	// const handleChangePassword = () => {
	// 	setIsChangePasswordModalOpen(true);
	// };
	// const changePassword = async (newPassword) => {
	// 	try {
	// 		const token = localStorage.getItem("token");
	// 		await axios.post(
	// 			"http://localhost:5000/changePassword",
	// 			{ newPassword },
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		);
	// 		// После успешного изменения пароля
	// 		console.log("Пароль успешно изменен");
	// 		// Закрываем модальное окно

	// 		setSuccessMessageOpen(true);
	// 		setIsChangePasswordModalOpen(false);
	// 		setNewPassword("");
	// 	} catch (error) {
	// 		console.error("Ошибка при изменении пароля:", error);
	// 		// Обработка ошибки
	// 	}
	// };
	const validateFields = () => {
		let valid = true;
		const newErrors = {};

		// Проверка наличия значений
		Object.keys(userData).forEach((key) => {
			if (!userData[key]) {
				newErrors[key] = "Поле не может быть пустым";
				valid = false;
			}
		});

		setErrors(newErrors);
		return valid;
	};

	const handleSave = () => {
		if (validateFields()) {
			// Проверяем, изменились ли данные
			const isDataChanged = userData.Fsp !== initialUserData.Fsp || userData.email !== initialUserData.email || userData.number !== initialUserData.number;

			if (isDataChanged) {
				// Создаем новый объект только с измененными данными
				const changedData = {};

				if (userData.Fsp !== initialUserData.Fsp) {
					changedData.Fsp = userData.Fsp;
				}
				if (userData.email !== initialUserData.email) {
					changedData.email = userData.email;
				}
				if (userData.number !== initialUserData.number) {
					changedData.number = userData.number;
				}

				axios
					.post(`${BASE_URL}/api/editUser`, changedData, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					})
					.then((response) => {
						setIsEditing(false);
						setEdited(true);
						if (userData.email !== localStorage.getItem("name")) {
							localStorage.setItem("name", userData.email);
							if (response.data.token) {
								localStorage.setItem("token", response.data.token);
							}
						}
					})
					.catch((error) => {
						console.error("Ошибка при обновлении данных:", error);
						if (error.response && error.response.data && error.response.data.error) {
							setErrors({ ...errors, ...error.response.data.error });
						}
					});
			} else {
				// Если данные не изменились, просто завершаем редактирование
				setIsEditing(false);
			}
		}
	};

	const handleLogout = async () => {
		try {
			await axios({
				method: "POST",
				url: `${BASE_URL}/api/logout`,
			});
			// console.log(req.data);

			localStorage.removeItem("name");
			localStorage.removeItem("token");
			// alert("Выход прошло успешно");
			window.location.href = "/";
		} catch (error) {
			alert("Ошибка при выходе из аккаунта, повторите попытку");
			console.log(error.response);
		}
	};
	const handleCloseSuccessMessage = () => {
		setSuccessMessageOpen(false);
	};
	return (
		<>
			{successMessageOpen && (
				<Snackbar
					open={successMessageOpen}
					autoHideDuration={6000}
					onClose={handleCloseSuccessMessage}
				>
					<Alert
						onClose={handleCloseSuccessMessage}
						severity="success"
						sx={{ width: "100%" }}
					>
						Пароль успешно изменен!
					</Alert>
				</Snackbar>
			)}
			{!loading ? (
				<div className={styles.container}>
					<h2>Личный кабинет</h2>
					<img
						src={placeholderImage}
						alt="Placeholder"
						className={styles.profileImage}
					/>
					<div className={styles.userInfo}>
						<div>
							<p>
								<strong>Имя:</strong>{" "}
								{isEditing ? (
									<input
										type="text"
										name="Fsp"
										value={userData.Fsp}
										onChange={handleChange}
									/>
								) : (
									userData.Fsp
								)}
							</p>
							{errors.name && <p className={styles.error}>{errors.name}</p>}
							<p>
								<strong>Email:</strong>{" "}
								{isEditing ? (
									<input
										type="email"
										name="email"
										value={userData.email}
										onChange={handleChange}
									/>
								) : (
									userData.email
								)}
							</p>
							{errors.email && <p className={styles.error}>{errors.email}</p>}
							<p>
								<strong>Телефон:</strong>{" "}
								{isEditing ? (
									<InputMask
										mask="+7 (999) 999-99-99"
										maskChar="_"
										type="tel"
										name="number"
										value={userData.number}
										onChange={handleChange}
									>
										{(inputProps) => <input {...inputProps} />}
									</InputMask>
								) : (
									userData.number
								)}
							</p>
							{errors.phone && <p className={styles.error}>{errors.phone}</p>}

						</div>
					</div>
					{!isEditing ? (
						<button
							onClick={() => setIsEditing(true)}
							className={styles.btnPrimary}
						>
							Редактировать
						</button>
					) : (
						<div className={styles.btnBlocks}>
							<button
								onClick={handleSave}
								className={`${styles.btnPrimary}`}
								// disabled={!edited}
							>
								Сохранить
							</button>
							<button
								onClick={() => setIsEditing(false)}
								className={`${styles.btnPrimary}`}
							>
								Отмена
							</button>
						</div>
					)}
					<Link
						to="/orders"
						className={styles.btnSecondary}
					>
						Мои заказы
					</Link>
					<button
						onClick={handleLogout}
						className={styles.btnLogout}
					>
						Выйти
					</button>
					{userData?.Fsp === 'admin' && <Link
						to="/admin"
						className={styles.btnSecondary}
					>
						Админ панель
					</Link>}

					{edited ? <p className={styles.edited}>Данные изменены</p> : ""}
				</div>
			) : (
				<div className="loaderContainer">
					<span className="loader"></span>
				</div>
			)}
		</>
	);
}
