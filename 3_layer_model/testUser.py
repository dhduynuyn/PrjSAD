from flask import Flask, request, jsonify
from BUS.userBUS import UserBUS

app = Flask(__name__)
user_bus = UserBUS()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = user_bus.login(data['username'], data['password'])
    
    if user:
        return jsonify({
            "user_id": user.user_id,
            "username": user.username,
            "full_name": user.full_name
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_bus.signup(data['username'], data['password'], data['full_name'])
    return jsonify({"message": "User registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
