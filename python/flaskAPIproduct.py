import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
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


app = Flask(__name__)


@app.route('/api/product', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM product ORDER BY product_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/product/<int:product>', methods=['GET'])
def show(product):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM product WHERE product_id=?', (str(product),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/product', methods=['POST'])
def store():
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
def update(product):
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
def delete(product):
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