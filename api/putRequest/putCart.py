from core import *
from instance.models import *

from flask import request
from werkzeug.utils import secure_filename
import os


@application.route('/addRolls', methods=["PUT"])
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

@application.route('/addItemAdmin', methods=['POST'])
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
            filename = secure_filename(imageFile.filename)
            unique_filename = f"{'_'.join(categories.split(','))}_{filename}"  # Категории в имени файла
            upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../front/public/assets/img/rolls'))
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            path = os.path.join(upload_folder, unique_filename)
            imageFile.save(path)

            # Формирование ссылки
            imageURL = f"/assets/img/rolls/{unique_filename}"

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
