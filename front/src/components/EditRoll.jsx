import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {BASE_URL} from "../constants";

export default function EditRoll() {
	const [rolls, setRolls] = useState([]);
	const [editRoll, setEditRoll] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const [rollData, setRollData] = useState({
		name: "",
		sizes: "",
		price: "",
		imageURL: "",
		imageFile: null,
	});
	const [imageLoaded, setImageLoaded] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarOpenEdit, setSnackbarOpenEdit] = useState(false);
	const allCategories = ["Запеченные", "С угрем", "Горячие", "Холодные", "Темпурные"];
	const allSizes = ["105гр.", "200гр.", "270гр."];

	const fileInputRef = useRef(null);

	useEffect(() => {
		axios
			.get(`${BASE_URL}/api/rolls`)
			.then((response) => {
				setRolls(response.data);
			})
			.catch((error) => {
				console.error("Error fetching rolls:", error);
			});
	}, []);

	const handleRollChange = (event) => {
		const { name, value, type, files } = event.target;

		if (type === "file") {
			setRollData({ ...rollData, imageURL: "", imageFile: files[0] });
			setImageLoaded(false);
		} else {
			setRollData({ ...rollData, [name]: value });
		}
	};

	const handleDeleteRoll = async (id) => {
		try {
			const response = await axios.delete(`${BASE_URL}/api/deleteRoll/${id}`);
			
			if (response.status === 200) {
				setRolls(prevRolls => prevRolls.filter(roll => roll.id !== id));
				setSnackbarOpen(true);
			} else {
				alert("Не удалось удалить товар");
			}
		} catch (error) {
			console.error("Ошибка удаления:", error);
			alert("Ошибка удаления товара");
		}
	};

	const handleEditRoll = (id) => {
		const foundRoll = rolls.find(roll => roll.id === id);
		if (foundRoll) {
			setEditingId(id);
			setRollData({ 
				...foundRoll,
				category: [...foundRoll.category], // создаем новый массив
				sizes: [...foundRoll.sizes] // создаем новый массив
			});
		}
	};

	const handleSaveEdit = async (id) => {
		try {
			const formData = new FormData();
			formData.append("name", rollData.name);
			formData.append("sizes", rollData.sizes);
			formData.append("category", rollData.category);
			formData.append("rating", rollData.rating);
			formData.append("price", rollData.price);
			formData.append("imageFile", rollData.imageFile);
			formData.append("imageURL", rollData.imageURL);
			
			await axios.post(`${BASE_URL}/api/editRoll/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Обновляем локальное состояние
			setRolls(prevRolls => 
				prevRolls.map(roll => 
					roll.id === id ? { ...rollData } : roll
				)
			);
			
			setEditingId(null);
			setSnackbarOpenEdit(true);
		} catch (error) {
			console.error("Error saving roll:", error);
		}
	};

	const closeEdit = () => {
		setEditingId(null)
	};
	
	const handleSnackbarClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbarOpen(false);
		setSnackbarOpenEdit(false);
	};

	return (
		<div className="container">
			<div id="rolls-list">
				<h2>Список товаров</h2>
					<div style={{ width: '100%', overflow: 'auto' }}>
						<table style={{ minWidth: '100%', tableLayout: 'auto' }}>
						<thead>
							<tr>
								<th>Изображение</th>
								<th>Название</th>
								<th>Категории</th>
								<th>Масса</th>
								<th style={{whiteSpace: "nowrap"}}>Стоимость, ₽</th>
								<th>Действия</th>
							</tr>
						</thead>
						<tbody>
							{rolls.map((roll, index) => (
								<tr key={index}>
									<td className="td-table">
										<>
											<input
												type="text"
												className="edit-input"
												value={editingId  === roll.id ? rollData.imageURL : roll.imageURL}
												onChange={handleRollChange}
												name="imageURL"
												disabled={editingId !== roll.id}
											/>
											<input
												ref={fileInputRef}
												type="file"
												accept="image/*"
												onChange={handleRollChange}
												name="imageFile"
												disabled={editingId !== roll.id}
													className="input-forimage"
											/>
											{imageLoaded && <div>Изображение загружено</div>}
										</>
									</td>
									<td>
										{editingId === roll.id ? (
											<input
												type="text"
												className="edit-input"
												value={rollData.name}
												onChange={handleRollChange}
												name="name"
											/>
										) : (
											roll.name
										)}
									</td>
									<td>
										{editingId === roll.id ? (
											<div className="category-checkboxes">
												{allCategories.map((cat) => (
													<label key={cat}>
														<input
															type="checkbox"
															name="category"
															value={cat}
															checked={rollData.category?.includes(cat)}
															onChange={(e) => {
																const selected = rollData.category || [];
																const newSelected = e.target.checked
																	? [...selected, cat]
																	: selected.filter((c) => c !== cat);
																setRollData({ ...rollData, category: newSelected });
															}}
															disabled={!editingId}
														/>
														{cat}
													</label>
												))}
											</div>
										) : (
											roll.category?.join(', ')
										)}
									</td>
									<td>
										{editingId === roll.id ? (
											<div className="category-checkboxes">
												{allSizes.map((cat) => (
													<label key={cat}>
														<input
															type="checkbox"
															name="category"
															value={cat}
															checked={rollData.sizes?.includes(cat)}
															onChange={(e) => {
																const selected = rollData.sizes || [];
																const newSelected = e.target.checked
																	? [...selected, cat]
																	: selected.filter((c) => c !== cat);
																setRollData({ ...rollData, sizes: newSelected });
															}}
															disabled={!editingId}
														/>
														{cat}
													</label>
												))}
											</div>
										) : (
											roll.sizes?.join(', ')
										)}
									</td>
									<td>
										{editingId === roll.id ? (
											<input
												type="text"
												className="edit-input"
												value={rollData.price}
												onChange={handleRollChange}
												name="price"
											/>
										) : (
											roll.price
										)}
									</td>
									<td>
										{editingId === roll.id ? (
											<div className="edit-actions">
												<button
													className="save-btn"
													onClick={() => handleSaveEdit(roll.id)}
												>
													Сохранить
												</button>
												<button
													className="cancel-btn"
													onClick={closeEdit}
												>
													Отмена
												</button>
											</div>
										) : (
											<div className="edit-actions">
												<button onClick={() => handleEditRoll(roll.id)}>Редактировать</button>
												<button
													onClick={() => handleDeleteRoll(roll.id)}
													className="cancel-btn"
												>
													Удалить
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
						</table>
				</div>
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
					severity="info"
					sx={{ backgroundColor: "green" }}
				>
					Товар удален!
				</MuiAlert>
			</Snackbar>
			<Snackbar
				open={snackbarOpenEdit}
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
					severity="info"
					sx={{ backgroundColor: "green" }}
				>
					Данные изменены!
				</MuiAlert>
			</Snackbar>
		</div>
	);
}
