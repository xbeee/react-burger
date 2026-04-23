import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import styles from "./Register.module.scss";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import useToken from "../../hooks/useToken";
import RequireGuest from "../../components/RequireGuest";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../../constants";

export default function Register() {
	const [formData, setFormData] = React.useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		agree: false,
	});
	const [errorMessages, setErrorMessages] = React.useState("");
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = React.useState("");
	const [errors, setErrors] = React.useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
	});
	const { setToken } = useToken();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setErrors({ ...errors, [name]: "" }); // Очистка ошибок при изменении значения поля
	};

	const validateForm = () => {
		let valid = true;
		const newErrors = { ...errors };

		// Проверка ФИО
		if (!/^[А-Яа-яЁё\s]+$/.test(formData.fullName)) {
			newErrors.fullName = "ФИО может содержать только кириллицу и пробелы";
			valid = false;
		}

		// Проверка email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Некорректный email";
			valid = false;
		}

		// Проверка пароля
		if (formData.password.length < 8 || !/^[a-zA-Z0-9]+$/.test(formData.password)) {
			newErrors.password = "Пароль должен содержать минимум 8 символов, только латиницу и цифры";
			valid = false;
		}

		// Проверка совпадения пароля и подтверждения
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Пароль и его подтверждение не совпадают";
			valid = false;
		}

		// Проверка телефона
		if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(formData.phoneNumber)) {
			newErrors.phoneNumber = "Некорректный номер телефона";
			valid = false;
		}

		// Проверка согласия на обработку персональных данных
		if (!formData.agree) {
			newErrors.agree = "Необходимо дать согласие на обработку персональных данных";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			if (validateForm()) {
				// console.log(formData);
				axios
					.post(`${BASE_URL}/api/register`, formData)
					.then((response) => {
						setToken(response.data.access_token);
						localStorage.setItem("name", formData.email);
						window.location.href = "/";
					})
					.catch((error) => {
						if (error.response.data.errCode === 4) {
							setSnackbarOpen(true);
							setErrorMessages("Ошибка. Пользователь с таким Email уже существует");
							setSnackbarSeverity("error");
						} else {
							setSnackbarOpen(true);
							setErrorMessages("Ошибка. Повторите ошибку позже");
						}
					});
			}
		} catch (error) {
		} finally {
			// setSnackbarOpen(true);
		}
	};
	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};
	return (
		<RequireGuest>
			<div className={styles.container}>
				<h2 className={styles.regsiter_title}>Регистрация</h2>
				<form
					onSubmit={handleSubmit}
					method="POST"
				>
					<div className={styles.formGroup}>
						<label
							htmlFor="fullName"
							className={styles.label}
						>
							ФИО
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faUser}
								className={styles.inputIcon}
							/>
							<input
								type="text"
								className={`${styles.formControl} ${errors.fullName && styles.error}`}
								id="fullName"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="Введите ФИО"
								required
							/>
						</div>
						{errors.fullName && <span className={styles.error_text}>{errors.fullName}</span>}
					</div>
					<div className={styles.formGroup}>
						<label
							htmlFor="email"
							className={styles.label}
						>
							Email
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faEnvelope}
								className={styles.inputIcon}
							/>
							<input
								type="email"
								className={`${styles.formControl} ${errors.email && styles.error}`}
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Введите email"
								required
							/>
						</div>
						{errors.email && <span className={styles.error_text}>{errors.email}</span>}
					</div>
					<div className={styles.formGroup}>
						<label
							htmlFor="password"
							className={styles.label}
						>
							Пароль
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faLock}
								className={styles.inputIcon}
							/>
							<input
								type="password"
								className={`${styles.formControl} ${errors.password && styles.error}`}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Введите пароль"
								required
							/>
						</div>
						{errors.password && <span className={styles.error_text}>{errors.password}</span>}
					</div>
					<div className={styles.formGroup}>
						<label
							htmlFor="confirmPassword"
							className={styles.label}
						>
							Подтверждение пароля
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faLock}
								className={styles.inputIcon}
							/>
							<input
								type="password"
								className={`${styles.formControl} ${errors.confirmPassword && styles.error}`}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Подтвердите пароль"
								required
							/>
						</div>
						{errors.confirmPassword && <span className={styles.error_text}>{errors.confirmPassword}</span>}
					</div>

					<div className={styles.formGroup}>
						<label
							htmlFor="phoneNumber"
							className={styles.label}
						>
							Номер телефона
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faPhone}
								className={styles.inputIcon}
							/>
							<InputMask
								mask="+7(999)-999-99-99"
								maskPlaceholder=""
								type="tel"
								className={`${styles.formControl} ${errors.phoneNumber && styles.error}`}
								id="phoneNumber"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								placeholder="+7 (___)-___-__-__"
								required
							/>
						</div>
						{errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
					</div>

					<div className={styles.formGroup}>
						<input
							type="checkbox"
							id="agree"
							name="agree"
							checked={formData.agree}
							onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
							className={styles.checkbox}
							required
						/>
						<label
							htmlFor="agree"
							className={styles.agreeLabel}
						>
							Согласен на обработку персональных данных
						</label>
					</div>
					<button
						type="submit"
						className={styles.btnPrimary}
					>
						Зарегистрироваться
					</button>
				</form>
				<div className={styles.registerLink}>
					Есть аккаунт? <Link to="/login">Авторизоваться</Link>
				</div>
			</div>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleSnackbarClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleSnackbarClose}
					severity={snackbarSeverity}
					sx={{ backgroundColor: snackbarSeverity === "success" ? "green" : "red" }}
				>
					{errorMessages}
				</MuiAlert>
			</Snackbar>
		</RequireGuest>
	);
}
