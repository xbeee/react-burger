import React, { useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../constants";

export default function AddProduct() {
	const [previewImage, setPreviewImage] = React.useState("");
	// const [imageName, setImageName] = React.useState("");
	const [rollData, setRollData] = React.useState({
		name: "",
		sizes: [],
		type: [],
		price: "",
		image: null,
		imageURL: "",
		rating: "",
		category: [],
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};
	// Обработчик изменения значения в полях ввода
	const handleRollChange = (event) => {
		const { name, value, type, checked } = event.target;

		if (type === "checkbox") {
			let updatedValues;
			if (checked) {
				updatedValues = [...rollData[name], value];
			} else {
				updatedValues = rollData[name].filter((item) => item !== value);
			}
			setRollData({ ...rollData, [name]: updatedValues });
		} else if (type === "file") {
			const file = event.target.files[0];
			setPreviewImage(URL.createObjectURL(file));
			setRollData({ ...rollData, [name]: file, imageURL: "" });
			// setImageName(file.name); // Сохранение имени файла
		} else if (name === "imageURL") {
			setRollData({ ...rollData, [name]: value, image: null });
		} else {
			setRollData({ ...rollData, [name]: value });
		}
	};

	// Обработчик добавления нового товара
	const handleAddRoll = async (event) => {
		event.preventDefault();

		// Создаем объект formData
		const formData = new FormData();
		formData.append("name", rollData.name);
		formData.append("price", rollData.price);
		formData.append("rating", rollData.rating);

		if (rollData.image) {
			formData.append("image", rollData.image);
		} else {
			formData.append("imageURL", rollData.imageURL);
		}
		formData.append("sizes", rollData.sizes);
		rollData.type.forEach((type) => formData.append("type", type));
		rollData.category.forEach((cat) => formData.append("category", cat));

		// Отправляем данные на сервер с помощью Axios
		try {
			const response = await axios.post(`${BASE_URL}/api/addItemAdmin`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if(response.status === 200){
				setSnackbarOpen(true);
				// document.getElementById('roll-image').value = null
				// document.getElementById('size-26').checked = false;
				// document.getElementById('size-30').checked = false;
				// document.getElementById('size-40').checked = false;
				// document.getElementById('cat-zapech').checked = false;
				// document.getElementById('cat-ugor').checked = false;
				// document.getElementById('cat-hot').checked = false;
				// document.getElementById('cat-cold').checked = false;
				// document.getElementById('cat-temp').checked = false;
				setRollData({
					name: "",
					sizes: "",
					type: [],
					price: "",
					image: null,
					imageURL: "",
					rating: "",
					category: []
				});
				setPreviewImage("");
			
			}
		} catch (error) {
			console.error("Ошибка:", error.message);
			alert('Ошибка добавления товара!')
		}

		// Очистка формы после отправки

		// setImageName("");
	};


	return (
		<>
			<div id="add-roll-block">
				<h2>Добавить товара в магазин</h2>
				<form
					id="roll-form"
					onSubmit={handleAddRoll}
					encType="multipart/form-data"
				>
					<label className="title" htmlFor="roll-name">Название:</label>
					<input
						type="text"
						id="roll-name"
						name="name"
						value={rollData.name}
						onChange={handleRollChange}
						required
					/>
					<label className="title" htmlFor="roll-sizes">Вес (в граммах):</label>
					<input
						type="text"
						id="roll-size"
						name="sizes"
						value={rollData.sizes}
						onChange={handleRollChange}
						placeholder=""
						required
					/>
					<label className="title" htmlFor="roll-price">Стоимость:</label>
					<input
						type="number"
						id="roll-price"
						name="price"
						value={rollData.price}
						onChange={handleRollChange}
						required
					/>
					<label className="title" htmlFor="roll-rating">Рейтинг товара (от 0 до 10):</label>
					<input
						type="number"
						id="roll-rating"
						name="rating"
						value={rollData.rating}
						onChange={handleRollChange}
						min="0"
						max="10"
						required
					/>
					<label className="title">Категория товара:</label>
					<div className="checkbox-container low">
						<input
							type="checkbox"
							id="cat-zapech"
							name="category"
							value="С луком"
							onChange={handleRollChange}
						/>
						<label htmlFor="cat-zapech">С луком</label>
					</div>
					<div className="checkbox-container low">
						<input
							type="checkbox"
							id="cat-ugor"
							name="category"
							value="С беконом"
							onChange={handleRollChange}
						/>
						<label htmlFor="cat-ugor">С беконом</label>
					</div>
					<div className="checkbox-container low">
						<input
							type="checkbox"
							id="cat-hot"
							name="category"
							value="Острые"
							onChange={handleRollChange}
						/>
						<label htmlFor="cat-hot">Острые</label>
					</div>
					<div className="checkbox-container low">
						<input
							type="checkbox"
							id="cat-cold"
							name="category"
							value="От шефа"
							onChange={handleRollChange}
						/>
						<label htmlFor="cat-cold">От шефа</label>
					</div>
					<div className="checkbox-container">
						<input
							type="checkbox"
							id="cat-temp"
							name="category"
							value="Куриные"
							onChange={handleRollChange}
						/>
						<label htmlFor="cat-temp">Куриные</label>
					</div>

				
					<label className="title" htmlFor="roll-image">Загрузить картинку:</label>
					<input
						type="file"
						id="roll-image"
						name="image"
						accept="image/*"
						onChange={handleRollChange}
						required
					/>
					<label className="title" htmlFor="roll-image-url">Или введите ссылку на изображение:</label>
					<input
						type="text"
						id="roll-image-url"
						name="imageURL"
						value={rollData.imageURL}
						onChange={handleRollChange}
					/>
					{previewImage && (
						<div className="preview-image">
							<p style={{color: 'black'}}>Предпросмотр фото</p>
							<img
								src={previewImage}
								alt="Preview"
								style={{ width: "100%", height: "auto" }}
							/>
						</div>
					)}
					<div className="submit-div">
						<input
							type="submit"
							value="Добавить товар"
						/>
					</div>
				</form>
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
					severity="success"
				>
					Товар успешно добавлен
				</MuiAlert>
			</Snackbar>
		</>
	);
}
