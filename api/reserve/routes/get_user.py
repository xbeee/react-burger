from instance.models import *
from auth import application
from instance.models import *
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity # pip install Flask_JWT_Extended
from flask import jsonify

@application.route('/api/users', methods=["GET"])
# @jwt_required()
def get_users():
    # current_user_email = get_jwt_identity()
    # user = User.query.filter_by(email=current_user_email).first()
    # if not user:
    #     return jsonify({'error': 'User not found'}), 404
    # if user.role != 'admin':
    #     return jsonify({'error': 'Unauthorized access'}), 403

    users = User.query.all()
    users_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'email': user.email,
            'Fsp': user.Fsp,
            'number': user.number
        }
        users_list.append(user_data)
    return jsonify(users_list)

@application.route('/api/get_user', methods=['GET'])
@jwt_required()
def get_admin():
    try:
        user_identity = get_jwt_identity()
        user = User.query.filter_by(email=user_identity).first()
        
        if user:
            if(user.Fsp == 'admin'):
                return jsonify({"is_admin": 'true'}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500