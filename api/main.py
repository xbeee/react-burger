from core import *
import auth
from instance.models import Rolls, User
import routes.getRoll
import routes.get_requset
import routes.get_user
import putRequest.putItem
import putRequest.putCart
import putRequest.putOrder
import json
import sys
import os

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
        admin_hashed_password = generate_password_hash(admin_password)
        admin_number = 0
        admin_role = "admin"
        admin_Fsp = "admin"
        
        admin_user = User(email=admin_email, password=admin_hashed_password, number=admin_number, role=admin_role, Fsp=admin_Fsp)
        db.session.add(admin_user)
        db.session.commit()
#     СreateMap()

if __name__ == '__main__':
    print("\n" + "="*60)
    print("ЗАРЕГИСТРИРОВАННЫЕ МАРШРУТЫ:")
    print("="*60)
    with application.app_context():
        for rule in application.url_map.iter_rules():
            # Фильтруем статические маршруты, если нужно
            if not rule.rule.startswith('/static'):
                methods = ', '.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
                print(f"Route: {rule.rule:30} Methods: {methods:15} Endpoint: {rule.endpoint}")
    print("="*60)
    print(f"Всего маршрутов: {len([r for r in application.url_map.iter_rules() if not r.rule.startswith('/static')])}")
    print("="*60 + "\n")

    print("Запуск сервера на http://127.0.0.1:5001")
    application.run(debug=True, port=5001)