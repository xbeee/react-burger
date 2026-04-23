import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import RequireGuest from "../../components/RequireGuest";
import useToken from "../../hooks/useToken";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../../constants";

export default function Login() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const { setToken } = useToken();
	const [focusedInput, setFocusedInput] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("info");

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleInputFocus = (inputName) => {
		setFocusedInput(inputName);
	};

	const handleInputBlur = () => {
		setFocusedInput(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post(`${BASE_URL}/api/login`, formData)
			.then((response) => {
				setToken(response.data.access_token);
				localStorage.setItem("name", formData.username);
				window.location.href = "/";
			})
			.catch((error) => {
				if (error.response && error.response.data.errCode === 2) {
					setSnackbarOpen(true);
					setSnackbarMessage("Ошибка. Неправильный логин или пароль.");
					setSnackbarSeverity("error");
				} else {
					setSnackbarOpen(true);
					setSnackbarMessage("Ошибка. Повторите попытку позже.");
					setSnackbarSeverity("error");
				}
				setSnackbarOpen(true);
			});
	};

	return (
		<RequireGuest>
			<div className={styles.container}>
				<h2>Авторизация</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label
							htmlFor="username"
							className={focusedInput === "username" ? styles.labelActive : ""}
						>
							Логин
						</label>
						<div className={styles.inputContainer}>
							<FontAwesomeIcon
								icon={faUser}
								className={styles.inputIcon}
							/>
							<input
								type="text"
								className={styles.formControl_login}
								id="username"
								name="username"
								value={formData.username}
								onChange={handleChange}
								onFocus={() => handleInputFocus("username")}
								onBlur={handleInputBlur}
								required
							/>
						</div>
					</div>
					<div className={styles.formGroup}>
						<label
							htmlFor="password"
							className={focusedInput === "password" ? styles.labelActive : ""}
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
								className={styles.formControl_login}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								onFocus={() => handleInputFocus("password")}
								onBlur={handleInputBlur}
								required
							/>
						</div>
					</div>
					<button
						type="submit"
						className={styles.btnPrimary}
					>
						Войти
					</button>
				</form>
				<div className={styles.registerLink}>
					Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
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
						{snackbarMessage}
					</MuiAlert>
				</Snackbar>
			</div>
		</RequireGuest>
	);
}
