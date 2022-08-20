import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'order_id': row[1],
        'product_id': row[2],
        'quantity': row[3],
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/order-item', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_item ORDER BY oi_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/order-item/<int:order_item>', methods=['GET'])
def show(order_item):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_item WHERE oi_id=?', (str(order_item),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/order-item', methods=['POST'])
def store():
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
def update(order_item):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != order_item:
        abort(400)

    update_order_item = (
        request.json['order_id'],
        request.json['product_id'],
        request.json['quantity'],
        str(update_order_item),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE order_item SET
            oi_order_id=?,oi_product_id=?,oi_quantity=?
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
def delete(order_item):
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