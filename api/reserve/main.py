
import json
import sys
import os
from extensions import db

# зависимости
from flask import Flask, request, redirect, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager # pip install Flask_JWT_Extended
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta, datetime
from flask_cors import CORS # pip install -U flask-cors
from datetime import timedelta, datetime
import json

# настройки прилажения
application = Flask(__name__, static_folder="build", static_url_path='')

CORS(application)

# настройки JWT
application.config["JWT_SECRET_KEY"] = "super-secret"
application.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=999999)
jwt = JWTManager(application)
# настройки БД
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rolls.db'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(application)

from instance.models import Rolls, User

with application.app_context():
    db.create_all()
    def СreateMap():
        from instance.models import Rolls
        script_dir = os.path.dirname(sys.argv[0])
        with open(os.path.join(script_dir, 'instance/rolls.json'), 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)

        for el in data:
            category = el['category']
            imageURl = el['imageURl']
            name = el['name']
            price = el['price']
            rating = el['rating']
            sizes = el['sizes']
            row = Rolls(sizes=sizes, rating=rating, price=price, name=name, imageURl=imageURl, category=category)
   
            db.session.add(row)
        admin_email = "admin@mail.ru"
        admin_password = "admin"
        admin_hashed_password = generate_password_hash(admin_password, method='pbkdf2')
        admin_number = 0
        admin_role = "admin"
        admin_Fsp = "admin"
        
        admin_user = User(email=admin_email, password=admin_hashed_password, number=admin_number, role=admin_role, Fsp=admin_Fsp)
        db.session.add(admin_user)
        db.session.commit()
    СreateMap()

# write_routes_to_txt(application)

import auth
import routes.get_requset
import routes.get_user
import putRequest.putItem
import putRequest.putCart
import putRequest.putOrder

@application.route('/api/rolls')
def GetRoll():
  try:
    rolls = Rolls.query.all()
    resp = []
    for el in rolls:
      row = {
          'id': el.id,
          'name': el.name,
          'imageURL': el.imageURl,
          'price': el.price,
          'sizes': el.sizes.split(',') if el.sizes else [],
          'price': el.price,
          'category': el.category.split(',') if el.category else [],
          'rating': el.rating
      }
      resp.append(row)
    return resp
  except Exception as e:
    return jsonify({'message': 'Failed to get cart', 'error': str(e)}), 500

@application.route('/api/register', methods=['POST'])
def Register():
    try:
        try:
            fullName = request.json.get('fullName') # Получение данных из формы
            email = request.json.get('email')
            password = request.json.get('password')
            phoneNumber = request.json.get('phoneNumber')
            role = 'user'
        except:
            resp = {
                "errCode": 1,
                "errString": "нехватает данных"
            }
            return resp, 401
    
        users = User.query.filter_by(email=email).first()
        if users:
            resp = {
                "errCode": 4,
                "errString": "такой пользователь уже есть"
            }
            return resp, 401
        password = generate_password_hash(password)
    
        user = User(email=email, password=password, number=phoneNumber, role=role, Fsp=fullName)
        db.session.add(user)
        db.session.commit()
    
        token = create_access_token(identity=email)
        return {'access_token':token}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Регистрируем Blueprint из auth.py
application.register_blueprint(auth.application)
    
def serve_index():
    return send_from_directory('build', 'index.html')

@application.route('/api/<path:path>')
def serve_static_file(path):
    if os.path.exists(os.path.join('build', path)):
        return send_from_directory('build', path)
    else:
        # Если файл не найден, вернем index.html (SPA routing)
        return send_from_directory('build', 'index.html')

@application.errorhandler(404)
def handle_404(e):
    return send_from_directory('build', 'index.html')

if __name__ == '__main__':
    with application.app_context():
        for rule in application.url_map.iter_rules():
            print(f"Route: {rule.rule}, Methods: {rule.methods}, Endpoint: {rule.endpoint}")
    application.run(host='0.0.0.0', debug=True)