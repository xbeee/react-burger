from instance.models import *
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token , unset_jwt_cookies, jwt_required, JWTManager # pip install Flask_JWT_Extended
from werkzeug.security import generate_password_hash, check_password_hash


application = Blueprint('auth', __name__)

@application.route('/api/login', methods=['POST'])
def Login():
    try:
        try:
            name = request.json.get('username')
            password = request.json.get('password')
        except:
            resp = {
                "errCode": 1,
                "errString": "нехватает данных"
            }
            return resp, 401

        user = User.query.filter_by(email=name).first()
        if user is None:
            resp = {
                "errCode": 2,
                "errString": "неверный логин"
            }
            return resp, 401
        if not check_password_hash(user.password, password):
            resp = {
                "errCode": 2,
                "errString": "неверный пароль"
            }
            return resp, 401
    
        token = create_access_token(identity=name)
        return {'access_token':token}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# выход из акаунта
@application.route('/api/logout', methods=["POST"])
def Logout():
    resp = jsonify({"msg":"logout successful"})
    unset_jwt_cookies(resp)
    return resp

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
        return {'access_token': token}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

