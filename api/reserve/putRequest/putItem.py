from instance.models import *
from werkzeug.utils import secure_filename
from flask import request, jsonify
from sqlalchemy import text
import sys
import os
from extensions import db
sys.path.append('../')
from auth import application
import uuid

# изменение товара в админке
@application.route('/api/editRoll/<int:roll_id>', methods=['POST'])
def edit_roll(roll_id):
  
    try:
        # Получение данных из запроса
        data = request.form
        name = data.get('name')
        size = request.form.getlist('sizes')
        sizes = ','.join(size)  # сохранить строкой
        categories = request.form.getlist('category')
        category = ','.join(categories)  # сохранить строкой
        rating = data.get('rating')
        price = data.get('price')
        imageURL = data.get('imageURL')
        imageFile = request.files.get('imageFile')

        # Поиск товара в базе данных по ID
        roll = Rolls.query.get(roll_id)

        if not roll:
            return jsonify({"error": "roll not found"}), 404

        # Обработка загрузки изображения
        if imageURL == '':
    # Генерация уникального имени файла без кириллицы
            file_ext = os.path.splitext(imageFile.filename)[1]  # получаем расширение файла
            unique_filename = f"{roll_id}_{uuid.uuid4().hex}{file_ext}"  # используем UUID + расширение
            
            # Путь для сохранения файла
            upload_folder = os.path.abspath(os.path.join(
                os.path.dirname(__file__),
                '../build/assets/img/rolls'
            ))
            os.makedirs(upload_folder, exist_ok=True)
            
            # Полный путь к файлу
            file_path = os.path.join(upload_folder, unique_filename)
            
            # Сохранение файла
            imageFile.save(file_path)
            
            # Формирование ссылки
            imageURL = f"/assets/img/rolls/{unique_filename}"

        # Обновление данных товара в базе данных
        roll.name = name
        roll.sizes = sizes
        roll.price = price
        roll.imageURl = imageURL
        roll.category = category
        roll.rating = rating

        # Сохранение изменений в базе данных
        db.session.commit()

        # Возвращение успешного ответа
        return jsonify({"message": "roll updated successfully", "imageURL": imageURL}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@application.route('/api/deleteRoll/<int:roll_id>', methods=['DELETE'])
def delete_roll(roll_id):
    try:
        roll = Rolls.query.filter_by(id=roll_id).first()

        if not roll:
            return jsonify({"error": "roll not found"}), 404

        db.session.delete(roll)
        db.session.commit()

        # Сброс автоинкремента для SQLite
        # db.session.execute(text("DELETE FROM sqlite_sequence WHERE name = 'Rolls'"))
        # db.session.commit()

        return jsonify({"message": "Roll deleted and IDs updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@application.route('/api/deleteUser/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        db.session.commit()

        # Сброс автоинкремента для SQLite
        # db.session.execute(text("DELETE FROM sqlite_sequence WHERE name = 'User'"))
        # db.session.commit()

        return jsonify({"message": "User deleted and IDs updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500