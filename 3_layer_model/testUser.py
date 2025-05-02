from flask import Flask, request, jsonify
from flask_cors import CORS
from BUS.userBUS import UserBUS

app = Flask(__name__)
CORS(app)
user_bus = UserBUS()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = user_bus.login(data['gmail'], data['password'])
    
    if user:
        return jsonify({
            "user_id": user.user_id,
            "username": user.username,
            "gmail": user.gmail
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_bus.signup(data['gmail'], data['password'], data['username'])
    return jsonify({"message": "User registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
