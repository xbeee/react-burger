import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import {BASE_URL} from "../constants";

export default function EditProfile({ users }) {
	const [userList, setUserList] = useState(users);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("info");

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const handleDeleteUser = async (userId) => {
		try {
			const response = await axios.delete(`${BASE_URL}/api/deleteUser/${userId}`);

			if (response.status === 200) {
				setUserList(userList.filter((user) => user.id !== userId));
				setSnackbarMessage("Пользователь удален");
				setSnackbarSeverity("success");
			} else {
				setSnackbarMessage(response.data.error || "Ошибка удаления пользователя");
				setSnackbarSeverity("error");
			}
		} catch (error) {
			setSnackbarMessage("Ошибка соединения с сервером");
			setSnackbarSeverity("error");
		} finally {
			setSnackbarOpen(true);
		}
	};

	return (
		<div id="users-block">
			<h3>Пользователи</h3>
			{userList.length === 0 ? (
				<h3>Пользователи не найдены</h3>
			) : (
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>ФИО</th>
							<th>Email</th>
							<th>Телефон</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{userList.map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.Fsp}</td>
								<td>{user.email}</td>
								<td>{user.number}</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDeleteUser(user.id)}
									>
										Удалить
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
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
	);
}
