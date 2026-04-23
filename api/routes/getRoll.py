from core import *
from instance.models import *

# все товары 
@application.route('/rolls', methods=["GET"])
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