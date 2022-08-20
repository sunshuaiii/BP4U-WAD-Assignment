import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
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


app = Flask(__name__)


@app.route('/api/order', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_details ORDER BY order_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/order/<int:order>', methods=['GET'])
def show(order):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_details WHERE order_id=?', (str(order),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/order', methods=['POST'])
def store():
    if not request.json:
        abort(404)

    new_order = (
        request.json['member_id'],
        request.json['ship_address'],
        request.json['courier'],
        request.json['ship_fee'],
        request.json['total'],
        request.json['status'],
        request.json['payment_id'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO order(order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_payment_id)
        VALUES(?,?,?,?,?,?,?)
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
def update(order):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order:
        abort(400)

    update_order = (
        request.json['member_id'],
        request.json['ship_address'],
        request.json['courier'],
        request.json['ship_fee'],
        request.json['total'],
        request.json['status'],
        request.json['payment_id'],
        str(order),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE order_details SET
            order_member_id=?,order_shipping_address=?,order_courier=?,order_shipping_fee=?,order_total=?,order_status=?,order_payment_id=?
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
def delete(order):
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

def api_response():
    from flask import jsonify
    if request.method == 'POST':
        return jsonify(**request.json)

        

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.debug = True
    app.run(host='0.0.0.0', port=port)