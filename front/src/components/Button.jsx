import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({ onClick, className, outline, children, disabled }) => {
	return (
		<button
			onClick={onClick}
			className={classNames("button", className, {
				"button--outline": outline,
			})}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

Button.propTypes = {
	onClick: PropTypes.func,
};

export default Button;
