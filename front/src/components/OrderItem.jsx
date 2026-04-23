import React from "react";

export default function OrderItem({ imageURL, product_name, product_type, product_size, price, quantity }) {
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
				<p>{`${product_size}`}</p>
			</div>
			<div className="cart__item-count">
				<b>{quantity} шт.</b>
			</div>

			<div className="cart__item-price">
				<b>{`${price} ₽`}</b>
			</div>
		</div>
	);
}
