import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import "./scss/app.scss";
import Main from "./pages/Main";
import AppContext from "./context";
import Login from "./pages/Login/Login";
import Register from "./pages/Regsiter/Register";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Order from "./pages/Order/Order";
import Footer from "./components/Footer";
import ProductInfo from "./pages/ProductInfo/ProductInfo";

function App() {
	const [userToken, setUserToken] = React.useState(null);
	React.useEffect(() => {
		async function getToken() {
			setUserToken(localStorage.getItem("token"));
		}
		getToken();
	}, []);

	return (
		<div className="App">
			<div className="wrapper">
				<AppContext.Provider value={{ userToken }}>
					<Header />
					<div className="content">
						<Routes>
							<Route
								path="/"
								element={<Main />}
							/>
							<Route
								path="/login"
								element={<Login />}
							/>
							<Route
								path="/register"
								element={<Register />}
							/>
							<Route
								path="/profile"
								element={<Profile />}
							/>
							<Route
								path="/cart"
								element={<Cart />}
							/>
							<Route
								path="/admin"
								element={<AdminPanel />}
							/>
							<Route
								path="/about"
								element={<ProductInfo />}
							/>
							<Route
								path="/orders"
								element={<Order />}
							/>
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</div>
					<Footer />
				</AppContext.Provider>
			</div>
		</div>
	);
}

export default App;
