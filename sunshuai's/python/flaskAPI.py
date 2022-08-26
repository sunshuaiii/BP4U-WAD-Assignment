import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_cart_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'member_id': row[1],
        'total': row[2],
        'creation_date': row[3],
    }

    return row_dict

def get_cart_item_in_cart_as_dict(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'price': row[2],
        'quantity': row[3],
        'photo': row[4],
    }

    return row_dict

def get_cart_item_in_cart_weight_as_dict(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'price': row[2],
        'quantity': row[3],
        'photo': row[4],
        'weight': row[5],
    }

    return row_dict

def get_cart_item_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'cart_id': row[1],
        'product_id': row[2],
        'quantity': row[3],
    }

    return row_dict

def get_cart_total_as_dict(row):
    row_dict = {
        'total': row[0],
    }

    return row_dict

def get_member_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'username': row[1],
        'fname': row[2],
        'lname': row[3],
        'password': row[4],
        'email': row[5],
        'phone': row[6],
        'address': row[7],
        'reg_date': row[8],
    }

    return row_dict


def get_order_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'member_id': row[1],
        'ship_address': row[2],
        'courier': row[3],
        'ship_fee': row[4],
        'total': row[5],
        'status': row[6],
        'creation_date': row[7],
        'payment_id': row[8],
    }

    return row_dict


def get_order_item_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'order_id': row[1],
        'product_id': row[2],
        'quantity': row[3],
    }

    return row_dict


def get_payment_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'order_id': row[1],
        'amount': row[2],
        'provider': row[3],
        'status': row[4],
        'creation_date': row[5],
    }

    return row_dict


def get_product_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'price': row[2],
        'weight': row[3],
        'stock': row[4],
        'discount': row[5],
        'photo': row[6],
        'desc': row[7],
        'creation_date': row[8],
        'category': row[9],
    }

    return row_dict

def get_order_last_row_as_dict(row):
    row_dict = {
        'id': row[0],
    }

    return row_dict

def get_product_quantity_in_cart_as_dict(row):
    row_dict = {
        'quantity': row[0],
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/cart', methods=['GET'])
def index_cart():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart ORDER BY cart_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/cart/cart-total/<int:cart>', methods=['GET'])
def show_cart_total(cart):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT round(SUM(product.product_price*(1-product.product_discount_percent) * cart_item.ci_quantity),2) FROM product INNER JOIN cart_item ON product.product_id = cart_item.ci_product_id WHERE cart_item.ci_cart_id=?', (str(cart),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_cart_total_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

# using
@app.route('/api/cart/total-weight/<int:cart>', methods=['GET'])
def show_cart_total_weight(cart):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT SUM(product.product_weight*cart_item.ci_quantity) FROM product INNER JOIN cart_item ON product.product_id = cart_item.ci_product_id WHERE cart_item.ci_cart_id=?', (str(cart),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_cart_total_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/cart/<int:cart>', methods=['GET'])
def show_cart(cart):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart WHERE cart_id=?', (str(cart),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_cart_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/cart', methods=['POST'])
def store_cart():
    if not request.json:
        abort(404)

    new_cart = (
        request.json['member_id'],
        request.json['total'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO cart(cart_member_id,cart_total)
        VALUES(?,?)
    ''', new_cart)

    cart_id = cursor.lastrowid

    db.commit()

    response = {
        'id': cart_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/cart/update-total/<int:cart>', methods=['PUT'])
def update_cart_total(cart):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart:
        abort(400)

    update_cart = (
        request.json['total'],
        str(cart),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart SET cart_total=? WHERE cart_id=?
    ''', update_cart)

    db.commit()

    response = {
        'id': cart,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/cart/<int:cart>', methods=['PUT'])
def update_cart(cart):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart:
        abort(400)

    update_cart = (
        request.json['total'],
        str(cart),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart SET
            cart_total=?
        WHERE cart_id=?
    ''', update_cart)

    db.commit()

    response = {
        'id': cart,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/cart/<int:cart>', methods=['DELETE'])
def delete_cart(cart):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM cart WHERE cart_id=?', (str(cart),))

    db.commit()

    response = {
        'id': cart,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/cart-item', methods=['GET'])
def index_cart_item():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart_item ORDER BY ci_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_item_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/cart-item/incart/total/<int:cart_item>', methods=['GET'])
def show_cart_item_in_cart_total(cart_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT ci_product_id, product_name, round(SUM(product.product_price*(1-product.product_discount_percent) * cart_item.ci_quantity),2),ci_quantity,product_photo FROM product INNER JOIN cart_item ON product.product_id=cart_item.ci_product_id WHERE cart_item.ci_cart_id=?', (str(cart_item),))
    rows = cursor.fetchall()
    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_item_in_cart_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/cart-item/incart/<int:cart_item>', methods=['GET'])
def show_cart_item_in_cart(cart_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT ci_product_id, product_name, round(product.product_price*(1-product.product_discount_percent),2),ci_quantity,product_photo FROM product INNER JOIN cart_item ON product.product_id=cart_item.ci_product_id WHERE cart_item.ci_cart_id=?', (str(cart_item),))
    rows = cursor.fetchall()
    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_item_in_cart_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/cart-item/incart/weight/<int:cart_item>', methods=['GET'])
def show_cart_item_in_cart_weight(cart_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT ci_product_id, product_name, round(product.product_price*(1-product.product_discount_percent),2),ci_quantity,product_photo,product_weight FROM product INNER JOIN cart_item ON product.product_id=cart_item.ci_product_id WHERE cart_item.ci_cart_id=?', (str(cart_item),))
    rows = cursor.fetchall()
    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_item_in_cart_weight_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/cart-item/incart/<int:cart_item>/<int:cart_item_index>', methods=['GET'])
def show_index_cart_item_in_cart(cart_item, cart_item_index):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT cart_item.ci_id, product_name, round(product.product_price*(1-product.product_discount_percent),2), cart_item.ci_quantity, product_photo FROM product INNER JOIN cart_item ON product.product_id=cart_item.ci_product_id WHERE cart_item.ci_cart_id=? AND cart_item.ci_product_id=?', (str(cart_item), str(cart_item_index)))
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_cart_item_in_cart_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/cart-item/<int:cart_item>', methods=['GET'])
def show_cart_item(cart_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart_item WHERE ci_id=?', (str(cart_item),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_cart_item_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

# using
@app.route('/api/cart-item', methods=['POST'])
def store_cart_item():
    if not request.json:
        abort(404)

    new_cart_item = (
        request.json['cart_id'],
        request.json['product_id'],
        request.json['quantity'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO cart_item(ci_cart_id, ci_product_id, ci_quantity) VALUES (?,?,?)
    ''', new_cart_item)

    cart_item_id = cursor.lastrowid

    db.commit()

    response = {
        'id': cart_item_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

# using
@app.route('/api/cart-item/update-quantity/<int:cart_id>/<int:product_id>', methods=['PUT'])
def update_cart_item_quantity(cart_id, product_id):

    update_cart_item = (
        str(cart_id),
        str(product_id),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart_item SET ci_quantity=ci_quantity+1 WHERE ci_cart_id=? AND ci_product_id=?
    ''', update_cart_item)

    db.commit()

    response = {
        'affected': db.total_changes,
    }

    return jsonify(response), 201

# using
@app.route('/api/cart-item/update-quantity/id/<int:cart_item_id>/<int:quantity>', methods=['PUT'])
def update_cart_item_quantity_use_id(cart_item_id, quantity):

    update_cart_item = (
        str(quantity),
        str(cart_item_id),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart_item SET ci_quantity=? WHERE ci_id=?
    ''', update_cart_item)

    db.commit()

    response = {
        'affected': db.total_changes,
    }

    return jsonify(response), 201


@app.route('/api/cart-item/<int:cart_item>', methods=['PUT'])
def update_cart_item(cart_item):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart_item:
        abort(400)

    update_cart_item = (
        request.json['quantity'],
        str(cart_item),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart_item SET
            ci_quantity=?
        WHERE ci_id=?
    ''', update_cart_item)

    db.commit()

    response = {
        'id': cart_item,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

# using
@app.route('/api/cart-item/<int:cart_item>', methods=['DELETE'])
def delete_cart_item(cart_item):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart_item:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM cart_item WHERE ci_id=?', (str(cart_item),))

    db.commit()

    response = {
        'id': cart_item,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/member', methods=['GET'])
def index_member():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM member ORDER BY member_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_member_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/member/<int:member>', methods=['GET'])
def show_member(member):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM member WHERE member_id=?', (str(member),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_member_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/member', methods=['POST'])
def store_member():
    if not request.json:
        abort(404)

    new_member = (
        request.json['username'],
        request.json['fname'],
        request.json['lname'],
        request.json['password'],
        request.json['email'],
        request.json['phone'],
        request.json['address'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address)
        VALUES(?,?,?,?,?,?,?)
    ''', new_member)

    member_id = cursor.lastrowid

    db.commit()

    response = {
        'id': member_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/member/<int:member>', methods=['PUT'])
def update_member(member):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != member:
        abort(400)

    update_member = (
        request.json['username'],
        request.json['fname'],
        request.json['lname'],
        request.json['password'],
        request.json['email'],
        request.json['phone'],
        request.json['address'],
        str(member),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE member SET
            member_username=?,member_first_name=?,member_last_name=?,member_password=?,member_email=?,member_phone=?,member_address=?
        WHERE member_id=?
    ''', update_member)

    db.commit()

    response = {
        'id': member,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/member/<int:member>', methods=['DELETE'])
def delete_member(member):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != member:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM member WHERE member_id=?', (str(member),))

    db.commit()

    response = {
        'id': member,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order', methods=['GET'])
def index_order():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_details ORDER BY order_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

@app.route('/api/order/getId', methods=['GET'])
def index_order_last():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('select seq from sqlite_sequence where name="order_details"')
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_order_last_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/order/<int:order>', methods=['GET'])
def show_order(order):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM order_details WHERE order_id=?', (str(order),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_order_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

# using
@app.route('/api/order', methods=['POST'])
def store_order():
    if not request.json:
        abort(404)

    new_order = (
        request.json['member_id'],
        request.json['ship_address'],
        request.json['ship_fee'],
        request.json['total'],
        request.json['status'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO order_details(order_member_id,order_shipping_address,order_shipping_fee,order_total,order_status)
        VALUES(?,?,?,?,?)
    ''', new_order)

    order_id = cursor.lastrowid

    db.commit()

    response = {
        'id': order_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order/<int:order>', methods=['PUT'])
def update_order(order):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order:
        abort(400)

    update_order = (
        request.json['ship_address'],
        request.json['courier'],
        request.json['ship_fee'],
        request.json['total'],
        request.json['status'],
        str(order),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE order_details SET
            order_shipping_address=?,order_courier=?,order_shipping_fee=?,order_total=?,order_status=?
        WHERE order_id=?
    ''', update_order)

    db.commit()

    response = {
        'id': order,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order/<int:order>', methods=['DELETE'])
def delete_order(order):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM order_details WHERE order_id=?', (str(order),))

    db.commit()

    response = {
        'id': order,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order-item', methods=['GET'])
def index_order_item():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_item ORDER BY oi_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_order_item_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/order-item/<int:order_item>', methods=['GET'])
def show_order_item(order_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_item WHERE oi_id=?',
                   (str(order_item),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_order_item_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/order-item', methods=['POST'])
def store_order_item():
    if not request.json:
        abort(404)

    new_order_item = (
        request.json['order_id'],
        request.json['product_id'],
        request.json['quantity'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
        VALUES(?,?,?)
    ''', new_order_item)

    order_item_id = cursor.lastrowid

    db.commit()

    response = {
        'id': order_item_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order-item/<int:order_item>', methods=['PUT'])
def update_order_item(order_item):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order_item:
        abort(400)

    update_order_item = (
        request.json['quantity'],
        str(order_item),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE order_item SET
            oi_quantity=?
        WHERE oi_id=?
    ''', update_order_item)

    db.commit()

    response = {
        'id': order_item,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/order-item/<int:order_item>', methods=['DELETE'])
def delete_order_item(order_item):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order_item:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM order_item WHERE oi_id=?', (str(order_item),))

    db.commit()

    response = {
        'id': order_item,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/payment', methods=['GET'])
def index_payment():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM payment ORDER BY payment_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_payment_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/payment/<int:payment>', methods=['GET'])
def show_payment(payment):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM payment WHERE payment_id=?', (str(payment),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_payment_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200

# using
@app.route('/api/payment', methods=['POST'])
def store_payment():
    if not request.json:
        abort(404)

    new_payment = (
        request.json['order_id'],
        request.json['amount'],
        request.json['provider'],
        request.json['status'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO payment(payment_order_id,payment_amount,payment_provider,payment_status)
        VALUES(?,?,?,?)
    ''', new_payment)

    payment_id = cursor.lastrowid

    db.commit()

    response = {
        'id': payment_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/payment/<int:payment>', methods=['PUT'])
def update_payment(payment):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != payment:
        abort(400)

    update_payment = (
        request.json['amount'],
        request.json['provider'],
        request.json['status'],
        str(payment),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE payment SET
            payment_amount=?,payment_provider=?,payment_status=?
        WHERE payment_id=?
    ''', update_payment)

    db.commit()

    response = {
        'id': payment,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/payment/<int:payment>', methods=['DELETE'])
def delete_payment(payment):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != payment:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM payment WHERE payment_id=?', (str(payment),))

    db.commit()

    response = {
        'id': payment,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

# using
@app.route('/api/product', methods=['GET'])
def index_product():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM product ORDER BY product_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/product/quantity-in-cart/<int:cart>/<int:product>', methods=['GET'])
def get_product_quantity_in_cart(cart, product):
    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('SELECT COUNT(*) FROM cart_item WHERE ci_cart_id=? AND ci_product_id=?', (str(cart), str(product),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_product_quantity_in_cart_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


# using
@app.route('/api/product/new-released', methods=['GET'])
def index_new_released_products():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE (SELECT julianday("now") - julianday(product_creation_date)) < 30 ORDER BY product_id ')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/product/on-sales', methods=['GET'])
def index_on_sales_products():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE product_discount_percent > 0 ORDER BY product_id ')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/product/album', methods=['GET'])
def index_product_album():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE product_category="ALBUM" ORDER BY product_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/product/magazine', methods=['GET'])
def index_product_magazine():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE product_category="MAGAZINE" ORDER BY product_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# using
@app.route('/api/product/fashion', methods=['GET'])
def index_product_fashion():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE product_category="FASHION" ORDER BY product_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/product/<int:product>', methods=['GET'])
def show_product(product):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM product WHERE product_id=?', (str(product),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_product_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/product/search/<string:productName>', methods=['GET'])
def index_product_search(productName):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM product WHERE product_name LIKE "%?%" COLLATE NOCASE ORDER BY product_id', (str(productName)))
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_product_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/product', methods=['POST'])
def store_product():
    if not request.json:
        abort(404)

    new_product = (
        request.json['name'],
        request.json['price'],
        request.json['weight'],
        request.json['stock'],
        request.json['discount'],
        request.json['photo'],
        request.json['desc'],
        request.json['category'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_category)
        VALUES(?,?,?,?,?,?,?,?)
    ''', new_product)

    product_id = cursor.lastrowid

    db.commit()

    response = {
        'id': product_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/product/<int:product>', methods=['PUT'])
def update_product(product):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != product:
        abort(400)

    update_product = (
        request.json['name'],
        request.json['price'],
        request.json['weight'],
        request.json['stock'],
        request.json['discount'],
        request.json['photo'],
        request.json['desc'],
        request.json['category'],
        str(product),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE product SET
            product_name=?,product_price=?,product_weight=?,product_stock=?,product_discount_percent=?,product_photo=?,product_desc=?,product_category=?
        WHERE product_id=?
    ''', update_product)

    db.commit()

    response = {
        'id': product,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/product/<int:product>', methods=['DELETE'])
def delete_product(product):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != product:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM product WHERE product_id=?', (str(product),))

    db.commit()

    response = {
        'id': product,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000,
                        type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.debug = True
    app.run(host='0.0.0.0', port=port)
