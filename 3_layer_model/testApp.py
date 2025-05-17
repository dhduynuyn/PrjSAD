from flask import Flask, request, jsonify
from BUS.storyBUS import StoryBUS
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_cors import CORS
from BUS.userBUS import UserBUS
import jwt
import datetime
SECRET_KEY = "your_secret_key"

from flask import make_response
user_bus = UserBUS()
app = Flask(__name__)
CORS(app, supports_credentials=True)
story_bus = StoryBUS()

@app.route('/truyen/<story_slug>/chapters', methods=['GET'])
def get_chapters(story_slug):
    try:
        chapters = story_bus.get_chapters_by_story_slug(story_slug)
        return jsonify(chapters), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/stories', methods=['GET'])
def get_all_stories():
    """Get all stories"""
    stories = story_bus.get_all_stories()
    return jsonify(stories), 200

@app.route('/stories/<int:story_id>', methods=['GET'])
def get_story_by_id(story_id):
    """Get a story by ID"""
    
    story = story_bus.get_story_by_id(story_id)
    if story:
        return jsonify(story), 200
    return jsonify({"error": "Story not found"}), 404

@app.route('/stories', methods=['POST'])
def add_story():
    """Add a new story"""
    data = request.json
    title = data['title']
    author = data['author']
    category = data['category']  # List of category IDs
    status = data['status']
    description = data.get('description', '')

    story_id = story_bus.add_story(title, author, category, status, description)
    return jsonify({"message": "Story added successfully", "story_id": story_id}), 201

PER_PAGE = 12

@app.route('/stories/paginated', methods=['GET'])
def get_paginated_stories():
    print("CALLLINGGGGGGGGGGGGGGGGG")
    """Get stories with pagination (no cache)."""
    try:
        page = int(request.args.get('page', 1))
        if page < 1:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid page number"}), 400

    all_stories = story_bus.get_all_stories()
    print("DEBUG @: ", len(all_stories))
    total_stories = len(all_stories)
    total_pages = (total_stories + PER_PAGE - 1) // PER_PAGE

    if page > total_pages:
        print("Error: Page out of range")
        return jsonify({"error": "Page out of range"}), 400

    start = (page - 1) * PER_PAGE
    end = start + PER_PAGE
    paginated_stories = all_stories[start:end]

    result = {
        "stories": paginated_stories,
        "total_pages": total_pages,
        "current_page": page
    }

    return jsonify(result), 200


@app.route('/stories/<int:story_id>', methods=['PUT'])
def update_story(story_id):
    """Update an existing story"""
    data = request.json
    success = story_bus.update_story(story_id, data['title'], data['author'], data['category'], data['status'], data['description'])
    if success:
        return jsonify({"message": "Story updated successfully"}), 200
    return jsonify({"error": "Story not found"}), 404

@app.route('/stories/<int:story_id>', methods=['DELETE'])
def delete_story(story_id):
    """Delete a story by ID"""
    success = story_bus.delete_story(story_id)
    if success:
        return jsonify({"message": "Story deleted successfully"}), 200
    return jsonify({"error": "Story not found"}), 404

@app.route('/stories/status/<string:status>', methods=['GET'])
def get_stories_by_status(status):
    """Get stories by status with optional limit"""
    limit = request.args.get('limit', default=6, type=int)

    stories = story_bus.get_stories_by_status(status, limit)
    if stories:
        return jsonify(stories), 200
    return jsonify({"error": "No stories found with the given status"}), 404

@app.route('/stories/slug/<string:story_slug>', methods=['GET'])
def get_story_details_by_slug(story_slug):
    story = story_bus.get_story_by_id(story_slug)
    if story:
        return jsonify(story), 200
    return jsonify({"error": "Story not found"}), 404


@app.route('/stories/slug/<string:story_slug>/chapters', methods=['GET'])
def get_story_chapters(story_slug):
    chapter = story_bus.get_chapter_by_id(story_slug)
    if chapter:
        return jsonify(chapter), 200
    return jsonify({"error": "Story not found"}), 404

@app.route('/stories/slug/<string:story_slug>/related', methods=['GET'])
def get_related_stories(story_slug):
    """Get related stories"""
    return jsonify([
        {"id": 2, "title": "Truyện liên quan 1", "coverUrl": "https://via.placeholder.com/100"},
        {"id": 3, "title": "Truyện liên quan 2", "coverUrl": "https://via.placeholder.com/100"},
    ]), 200

@app.route('/stories/<int:story_id>/bookmark', methods=['POST'])
def toggle_bookmark(story_id):
    """Toggle bookmark story"""
    return jsonify({"message": "Toggled bookmark successfully"}), 200

@app.route('/stories/<int:story_id>/report', methods=['POST'])
def report_story(story_id):
    """Report a story"""
    data = request.json
    reason = data.get('reason', '')
    return jsonify({"message": f"Reported story with reason: {reason}"}), 200

@app.route('/stories/<string:story_slug>/user_status', methods=['GET'])
def get_user_story_status(story_slug):
    """Get user's story status (favorited, bookmarked)"""
    return jsonify({
        "isFavorited": True,
        "isBookmarked": False
    }), 200

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

        user_info = {
            "user_id": user.user_id,
            "gmail": user.gmail,
            "name": user.username  # Thêm nếu có
        }

        response = make_response(jsonify({
            "message": "Login successful", 
            "user": user_info, 
            "token": token  # Thêm token vào phản hồi
        }))
        
        # Lưu token vào cookie (giữ cookie để sử dụng cho các yêu cầu sau)
        response.set_cookie('token', token, httponly=True)
        
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


from flask import request, jsonify
import jwt

@app.route('/current_user', methods=['GET'])
def get_current_user():
    token = request.cookies.get('token')
    if not token:
        return jsonify({'error': 'Không có token'}), 401
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        user = user_bus.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'Người dùng không tồn tại'}), 404

        return jsonify({
            'user_id': user.user_id,
            'gmail': user.gmail,
            'name': user.name
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token hết hạn'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token không hợp lệ'}), 401

def get_current_user_id():
    token = request.headers.get('Authorization')
    if not token:
        token = request.cookies.get('token')

    if not token:
        return None, 'Token is missing'

    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        return user_id, None
    except jwt.ExpiredSignatureError:
        return None, 'Token expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_bus.signup(data['gmail'], data['password'], data['username'])
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/user/story-status/<story_slug>', methods=['GET'])
@token_required
def get_story_status(payload, story_slug):
    user_id = payload['user_id']
    result = user_bus.get_story_status_for_user(user_id, story_slug)

    if result is None:
        return jsonify({"error": "Story or user not found"}), 404

    return jsonify(result), 200

@app.route('/stories/<int:story_id>/favorite', methods=['POST'])
@token_required
def toggle_favorite(payload, story_id):
    """Toggle favorite status of a story"""
    user_id = payload['user_id']

    # Kiểm tra xem truyện có tồn tại không
    story = story_bus.get_story_by_id(story_id)
    if not story:
        return jsonify({"error": "Story not found"}), 404

    story['favorites'] += 1  # Tăng số lượng yêu thích
    
    # Cập nhật số lượng yêu thích trong cơ sở dữ liệu
    user_bus.add_favorite(user_id, story_id)
    story_bus.update_story_favorites(story)
    message = "Đã thêm truyện vào danh sách yêu thích"

    # Trả về kết quả cho client
    return jsonify({
        "message": message,
        "updatedFavorites": story['favorites']  # Cập nhật số lượng yêu thích
    }), 200
    
@app.route('/stories/<int:story_id>/toggle-bookmark', methods=['POST'])
@token_required
def toggle_follow(payload, story_id):
    """Toggle favorite status of a story"""
    user_id = payload['user_id']

    # Kiểm tra xem truyện có tồn tại không
    story = story_bus.get_story_by_id(story_id)
    if not story:
        return jsonify({"error": "Story not found"}), 404

    story['followers'] += 1  # Tăng số lượng yêu thích
    
    # Cập nhật số lượng yêu thích trong cơ sở dữ liệu
    user_bus.add_follow(user_id, story_id)
    story_bus.update_story_follows(story)
    message = "Đã thêm truyện vào danh sách theo dõi"

    # Trả về kết quả cho client
    return jsonify({
        "message": message,
        "updatedFollowers": story['followers']  # Cập nhật số lượng yêu thích
    }), 200

@app.route("/stories/categories", methods=["GET"])
def get_categories():
    result = story_bus.get_categories()
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
