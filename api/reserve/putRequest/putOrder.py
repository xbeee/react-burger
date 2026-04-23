from instance.models import *
from sqlalchemy.exc import IntegrityError  # Добавьте в импорты
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from extensions import db
from auth import application
from flask import request, jsonify

@application.route('/api/addCart', methods=['POST'])
@jwt_required()
def add_to_cart():
    data = request.get_json()
    user_name = get_jwt_identity()

    user = User.query.filter_by(email=user_name).first()
    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    try:
        existing_item = Cart.query.filter_by(
            user_id=user.id,
            product_id=data['product_id'],
            product_size=data['product_size']
        ).first()

        if existing_item:
            existing_item.quantity += data['quantity']
        else:
            cart_item = Cart(
                user_id=user.id,
                product_id=data['product_id'],
                product_name=data['product_name'],
                product_size=data['product_size'],
                imageURL=data['imageURL'],
                price=data['price'],
                quantity=data['quantity']
            )
            db.session.add(cart_item)

        db.session.commit()
        return jsonify({"message": "Товар добавлен в корзину"}), 200

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Ошибка целостности данных", "details": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Неизвестная ошибка", "details": str(e)}), 500
      
@application.route('/api/updateCartItem', methods=['PUT'])
def update_cart_item():
    data = request.json
    product_id = data.get('productId')
    quantity = data.get('quantity')
    price = data.get('price')

    try:
        # Поиск товара в корзине по его ID и обновление количества
        cart_item = Cart.query.filter_by(product_id=product_id, product_size=data.get('product_size')).first()

        if cart_item:
            cart_item.quantity = quantity
            cart_item.price = price
            db.session.commit()
            return jsonify({'message': 'Количество товара успешно обновлено'})
        else:
            return jsonify({'error': 'Товар не найден в корзине'}), 404
    except Exception as e:
        print('Ошибка при обновлении количества товара:', str(e))
        return jsonify({'error': 'Ошибка сервера при обновлении количества товара'}), 500

@application.route('/api/deleteCartItem/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
  # Получаем имя пользователя из JWT токена
  user_name = get_jwt_identity()

  # Находим пользователя по имени (предположим, что имя пользователя уникально)
  user = User.query.filter_by(email=user_name).first()

  if not user:
    return {"error": "Пользователь не найден"}, 404

  # Пытаемся найти товар в корзине пользователя по его ID
  cart_item = Cart.query.filter_by(user_id=user.id, id=item_id).first()

  if not cart_item:
    return {"error": "Товар не найден в корзине"}, 404

  try:
    # Удаляем товар из базы данных
    db.session.delete(cart_item)
    db.session.commit()
    return {"message": "Товар успешно удален из корзины"}, 200
  except Exception as e:
    db.session.rollback()
    return {"error": "Произошла ошибка при удалении товара из корзины"}, 500

@application.route('/api/clearCart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    # Получаем email пользователя из JWT токена
    user_email = get_jwt_identity()

    # Находим пользователя по email
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404

    try:
        # Удаляем все товары из корзины пользователя
        Cart.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        return jsonify({'message': 'Корзина пользователя успешно очищена'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Произошла ошибка при очистке корзины'}), 500


@application.route('/api/userOrders', methods=['GET'])
@jwt_required()
def get_user_order():
  try:
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user:
      return jsonify({'message': 'User not found'}), 404

    user_id = current_user.id
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_id).all()

    user_orders = {}
    for order in orders:
      if order.order_id not in user_orders:
        user_orders[order.order_id] = []
        user_orders[order.order_id].append({
          'product_id': order.product_id,
          'product_name': order.product_name,
          'user_id': order.user_id,
          'quantity': order.quantity,
          'price': order.price,
          'product_size': order.product_size,
          'imageURL': order.imageURL
        })
      return jsonify({'orders': user_orders}), 200
  except Exception as e:
    db.session.rollback()
    return jsonify({'message': 'Failed to add order', 'error': str(e)}), 500

@application.route('/api/addOrder', methods=['POST'])
@jwt_required()
def add_order():
  current_user_email = get_jwt_identity()
  current_user = User.query.filter_by(email=current_user_email).first()

  if not current_user:
    return jsonify({'message': 'User not found'}), 404

  user_id = current_user.id
  cart_items = Cart.query.filter_by(user_id=user_id).all()

  if not cart_items:
    return jsonify({'message': 'Cart is empty'}), 404

  try:
      # Создаем уникальный идентификатор заказа
    order_id = str(uuid.uuid4())

    for item in cart_items:
      new_order = Order(
        order_id=order_id,
        user_id=user_id,
        product_id=item.product_id,
        quantity=item.quantity,
        product_name=item.product_name,
        imageURL=item.imageURL,
        price=item.price,
        product_size=item.product_size,
        status='в работе'
      )
      db.session.add(new_order)
      db.session.delete(item)

    db.session.commit()
    return jsonify({'message': 'Order placed successfully', 'order_id': order_id}), 200

  except Exception as e:
    db.session.rollback()
    return jsonify({'message': 'Failed to add order', 'error': str(e)}), 500
    
@application.route('/api/admin/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    # Проверяем, является ли пользователь администратором
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    
    if not current_user or not current_user.is_admin:  # Предполагаем, что в модели User есть поле is_admin
        return jsonify({'message': 'Access denied'}), 403
    
    orders = Order.query.all()
    orders_list = []
    
    for order in orders:
        orders_list.append({
            'id': order.id,
            'order_id': order.order_id,
            'product_id': order.product_id,
            'product_name': order.product_name,
            'user_id': order.user_id,
            'quantity': order.quantity,
            'price': order.price,
            'product_size': order.product_size,
            'imageURL': order.imageURL,
            'status': order.status
        })
    
    return jsonify(orders_list), 200
    
@application.route('/api/admin/orders/update-status', methods=['POST'])
@jwt_required()
def update_order_status():
    # Проверяем, является ли пользователь администратором
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    
    if not current_user or not current_user.is_admin:
        return jsonify({'message': 'Доступ запрещен'}), 403
    
    data = request.get_json()
    order_id = data.get('order_id')
    new_status = data.get('status')  # Любое значение, которое пришло с фронта
    
    if not order_id or not new_status:
        return jsonify({'message': 'Необходимы order_id и status'}), 400
    
    # Находим все записи с этим order_id (один заказ может содержать несколько товаров)
    orders = Order.query.filter_by(order_id=order_id).all()
    
    if not orders:
        return jsonify({'message': 'Заказ не найден'}), 404
    
    try:
        for order in orders:
            order.status = new_status  # Просто сохраняем статус как есть
        db.session.commit()
        return jsonify({'message': 'Статус заказа успешно обновлен', 'new_status': new_status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Ошибка обновления статуса', 'error': str(e)}), 500