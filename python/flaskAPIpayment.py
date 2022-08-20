import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'order_id': row[1],
        'amount': row[2],
        'provider': row[3],
        'status': row[4],
        'creation_date': row[5],
    }

    return row_dict


app = Flask(__name__)


@app.route('/api/payment', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM payment ORDER BY payment_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/payment/<int:payment>', methods=['GET'])
def show(payment):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM payment WHERE payment_id=?', (str(payment),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/payment', methods=['POST'])
def store():
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
        VALUES(?,?,?,?,?,?,?,?)
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
def update(payment):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != payment:
        abort(400)

    update_payment = (
        request.json['order_id'],
        request.json['amount'],
        request.json['provider'],
        request.json['status'],
        str(payment),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE payment SET
            payment_order_id=?,payment_amount=?,payment_provider=?,payment_status=?
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
def delete(payment):
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