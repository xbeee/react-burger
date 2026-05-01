from core import *
from instance.models import *
from werkzeug.utils import secure_filename
from flask import request
from sqlalchemy import text
import sys
import os
sys.path.append('../')
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
            # Генерация уникального имени файла
            filename = secure_filename(imageFile.filename)
            unique_filename = f"{roll_id}_{filename}"
            path = '../front/public/assets/img/rolls/' + imageFile.filename
            imageFile.save(path)
            os.rename(path, '../front/public/assets/img/rolls/'+ unique_filename)
            # path = '../../front/src/assets/img/rolls/' + imageFile.filename
            # imageFile.save(path)
            # os.rename(path, '../../front/src/assets/img/rolls/'+ unique_filename)

            # Сохранение изображения на сервере

            # Формирование ссылки на сохраненное изображение
            imageURL = f"/assets/img/rolls/{unique_filename}"  # Расширение jpg для примера

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

        all_rolls = Rolls.query.order_by(Rolls.id).all()
        for i, roll in enumerate(all_rolls):
            new_id = i + 1
            db.session.execute(text("UPDATE Rolls SET id = :new_id WHERE id = :old_id"), {'new_id': new_id, 'old_id': roll.id})

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

        all_users = User.query.order_by(User.id).all()
        for i, user in enumerate(all_users):
            new_id = i + 1
            db.session.execute(text("UPDATE User SET id = :new_id WHERE id = :old_id"), {'new_id': new_id, 'old_id': user.id})

        db.session.commit()

        # Сброс автоинкремента для SQLite
        # db.session.execute(text("DELETE FROM sqlite_sequence WHERE name = 'User'"))
        # db.session.commit()

        return jsonify({"message": "User deleted and IDs updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500