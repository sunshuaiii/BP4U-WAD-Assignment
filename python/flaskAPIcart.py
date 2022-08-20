import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'member_id': row[1],
        'total': row[2],
        'creation_date': row[3],
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/cart', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart ORDER BY cart_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/cart/<int:cart>', methods=['GET'])
def show(cart):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM cart WHERE cart_id=?', (str(cart),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/cart', methods=['POST'])
def store():
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


@app.route('/api/cart/<int:cart>', methods=['PUT'])
def update(cart):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != cart:
        abort(400)

    update_cart = (
        request.json['member_id'],
        request.json['total'],
        str(update_cart),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE cart SET
            cart_member_id=?,cart_total=?
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
def delete(cart):
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