import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const RequireGuest = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
		// console.log(isLoggedIn);
	}, []);

	if (isLoggedIn) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default RequireGuest;
