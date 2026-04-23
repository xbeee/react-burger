import React, { useEffect } from "react";
import "./AdminPanel.scss";
import axios from "axios";
import EditProfle from "../../components/EditProfle";
import AddRoll from "../../components/AddRoll";
import EditRoll from "../../components/EditRoll";
import { Navigate, useNavigate } from "react-router-dom";
import EditProfile from "../../components/EditProfle";
import {BASE_URL} from "../../constants";

export default function AdminPanel() {
	// Состояния для данных о пользователях
	const [activeSection, setActiveSection] = React.useState("");
	const [users, setUsers] = React.useState([]);
	const [rolls, setRolls] = React.useState([]);
	const [user, setUser] = React.useState("");

	const navigate = useNavigate();

	React.useEffect(() => {
		const token = localStorage.getItem("token");
		Promise.all([
			axios.get(`${BASE_URL}/api/get_user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
			axios.get(`${BASE_URL}/api/users`),
			axios.get(`${BASE_URL}/api/rolls`),
		])
			.then(([userResponse, usersResponse, rollsResponse]) => {
				setUsers(usersResponse.data);
				setRolls(rollsResponse.data);
				setUser(userResponse.data.is_admin);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);
	// console.log(user);

	return (
		<>
			{user !== "" && // Проверяем, определено ли значение user
				(user && user === "true" ? (
					<div className="container">
						<h3 className="adminTitle">Администрационная панель</h3>
						<div className="buttons">
							<button onClick={() => setActiveSection("users")}>Управление пользователями</button>
							<button onClick={() => setActiveSection("addRoll")}>Добавление товара</button>
							<button onClick={() => setActiveSection("editRoll")}>Изменение товара</button>
						</div>
						{activeSection === "users" && <EditProfile users={users} />}
						{activeSection === "addRoll" && <AddRoll />}
						{activeSection === "editRoll" && <EditRoll allroll={rolls} />}
					</div>
				) : (
					<Navigate to="/" />
				))}
		</>
	);
}
