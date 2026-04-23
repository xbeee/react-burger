from instance.models import *
from flask_jwt_extended import jwt_required, get_jwt
from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from extensions import db
from auth import application
import uuid

@application.route('/api/addRolls', methods=["PUT"])
@jwt_required()
def putItem():
    name = get_jwt()['sub']
    try:
        roll_id = request.json.get("roll_id")
        count = request.json.get('count')
    except:
        resp = {
            "errCode": 1,
            "errString": "нехватает данных"
        }
        return resp, 401
    
    # Получение пользователя по имени
    user = User.query.filter_by(name=name).first()
    if not user:
        resp = {
            "errCode": 2,
            "errString": "пользователь не найден"
        }
        return resp, 404
    
    # Проверяем, существует ли товар с указанным id
    roll = Rolls.query.get(roll_id)
    if not roll:
        resp = {
            "errCode": 3,
            "errString": "Товар не найдена"
        }
        return resp, 404
    
    # Создание новой записи в корзине
    new_item = Cart(user_id=user.id, roll_id=roll_id, count=count)
    db.session.add(new_item)
    db.session.commit()
    
    resp = {
        "success": True,
        "message": "Товар успешно добавлен в корзину"
    }
    return resp, 200

@application.route('/api/addItemAdmin', methods=['POST'])
def add_item():
    try:
        # Получение данных из запроса
        data = request.form
        name = data.get('name')
        sizes = ','.join(data.getlist('sizes'))
        price = data.get('price')
        rating = data.get('rating')
        categories = ','.join(data.getlist('category'))
        imageURL = data.get('imageURL')
        imageFile = request.files.get('image')

        # Проверка на наличие изображения
        if imageFile and imageFile.filename != '':
    # Получаем расширение файла
            file_ext = os.path.splitext(imageFile.filename)[1].lower()
            
            # Генерируем уникальное имя (только UUID + расширение)
            unique_filename = f"{uuid.uuid4().hex}{file_ext}"
            
            # Путь для сохранения
            upload_folder = os.path.abspath(os.path.join(
                os.path.dirname(__file__),
                '../build/assets/img/rolls'
            ))
            os.makedirs(upload_folder, exist_ok=True)
            
            # Сохраняем файл
            file_path = os.path.join(upload_folder, unique_filename)
            imageFile.save(file_path)
            
            # Формируем URL
            imageURL = f"/assets/img/rolls/{unique_filename}"
            print("Файл будет сохранён в:", upload_folder)
            print("Полный путь к файлу:", os.path.join(upload_folder, unique_filename))

        if not imageURL:
            return jsonify({"error": "Image URL or file is required"}), 400

        # Сохранение в базу
        roll = Rolls(
            name=name,
            sizes=sizes,
            price=price,
            rating=rating,
            category=categories,  # ✅ сохраняем строкой с запятыми
            imageURl=imageURL
        )
        db.session.add(roll)
        db.session.commit()

        return jsonify({
            "message": "Товар успешно добавлен",
            "data": {
                "name": name,
                "sizes": sizes.split(','),
                "price": price,
                "rating": rating,
                "category": categories.split(','), 
                "imageURL": imageURL
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
