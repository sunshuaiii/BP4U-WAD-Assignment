from flask import Flask
from flask_socketio import SocketIO, emit
import json
import math


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('connect', namespace='/circle')
def handle_connect_circle():
    print('Connected to /circle')


@socketio.on('client_connected', namespace='/circle')
def handle_client_connected_circle(json):
    print('Connection Status: {}'.format(json['connected']))


@socketio.on('client_send', namespace='/circle')
def handle_client_send_circle(json):
    radius = json['radius']

    # Compute Circumference & Area
    circumference = 2 * math.pi * radius
    area = math.pi * radius * radius

    # Emit result to client
    emit_result_circle(circumference, area)


def emit_result_circle(circumference, area):
    emit('server_send', json.dumps({
        'circumference': circumference,
        'area': area,
    }), namespace='/circle')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000,debug='true')