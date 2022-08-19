import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'bp4u.sqlite'

def get_row_as_dict(row):
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


app = Flask(__name__)


@app.route('/api/member', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM member ORDER BY member_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/member/<int:member>', methods=['GET'])
def show(member):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM member WHERE member_id=?', (str(member),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/member', methods=['POST'])
def store():
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
def update(member):
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
def delete(member):
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