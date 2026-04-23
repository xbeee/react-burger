import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../constants";

const RequireAdmin = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoad, setIsLoad] = useState(false);

	useEffect(() => {
		async function fetchUser() {
			setIsLoad(true);
			try {
				const token = localStorage.getItem("token");
				if (token) {
					const response = await axios.get(`${BASE_URL}/api/get_user`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					console.log("Response:", response.data);
					if (response.data.is_admin === "true") {
						console.log("User is admin");
						setIsAdmin(true);
					}
				} else {
					console.log("Token not found");
					setIsAdmin(false);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				alert("Ошибка получения данных о пользователе");
			} finally {
				setIsLoad(false);
			}
		}
		fetchUser();
	}, []);

	console.log("isAdmin:", isAdmin);
	console.log("isLoad:", isLoad);

	if (isLoad) {
		return <div>Loading...</div>;
	}

	if (!isAdmin) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default RequireAdmin;
