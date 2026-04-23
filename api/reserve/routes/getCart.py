from auth import application
from instance.models import *
from extensions import db
from flask_jwt_extended import jwt_required # pip install Flask_JWT_Extended
from flask import jsonify

@application.route('/api/getCart', methods=["GET"])
@jwt_required()
def getuser():
  cart = Cart.query.all();
  resp = []
  for el in cart:
    row = {
        'id': el.id,
        'id_user': el.id_user,
        'id_roll': el.id_roll,
    }
    resp.append(row)
  return resp


  # try:
  #   rolls = Rolls.query.all()
  #   # resp = []
  #   # for el in rolls:
  #   #   row = {
  #   #       'id': el.id,
  #   #       'name': el.name,
  #   #       'imageURL': el.imageURl,
  #   #       'price': el.price,
  #   #       'sizes': el.sizes.split(',') if el.sizes else [],
  #   #       'price': el.price,
  #   #       'category': el.category.split(',') if el.category else [],
  #   #       'rating': el.rating
  #   #   }
  #   #   resp.append(row)
  #   return rolls
  # except Exception as e:
  #   return jsonify({'message': 'Failed to get cart', 'error': str(e)}), 500
# для отдельного пользователя