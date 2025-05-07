from flask import Flask, request, jsonify
from flask_cors import CORS
from BUS.userBUS import UserBUS

app = Flask(__name__)
CORS(app)
user_bus = UserBUS()

import jwt
import datetime

SECRET_KEY = "your_secret_key"

from flask import make_response

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = user_bus.login(data['gmail'], data['password'])

    if user:
        payload = {
            "user_id": user.user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        response = make_response(jsonify({"message": "Login successful"}))
        response.set_cookie('token', token, httponly=True)  # chỉ frontend không đọc được
        return response, 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

def token_required(f):
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        # Lấy token từ header hoặc query param
        token = request.headers.get('Authorization')
        if not token:
            token = request.args.get('token')  # ✅ lấy từ URL nếu không có header

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(payload, *args, **kwargs)
    return decorated


# API để lấy user_id hiện tại
@app.route('/current_user', methods=['GET'])
@token_required
def get_current_user(payload):
    user_id = payload['user_id']
    return jsonify({"user_id": user_id}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_bus.signup(data['gmail'], data['password'], data['username'])
    return jsonify({"message": "User registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
