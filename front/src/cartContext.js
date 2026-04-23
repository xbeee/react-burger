import React from "react";

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
	const [cartTotal, setCartTotal] = React.useState({ quantity: 0, totalPrice: 0 });

	const updateCartTotal = (newCartTotal) => {
		setCartTotal(newCartTotal);
	};

	return <CartContext.Provider value={{ cartTotal, updateCartTotal }}>{children}</CartContext.Provider>;
};
