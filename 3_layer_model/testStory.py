from flask import Flask, request, jsonify
from BUS.storyBUS import StoryBUS
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
CORS(app)
story_bus = StoryBUS()
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})
story_bus = StoryBUS()

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

def refresh_cache_page_1():
    """Manually refresh cached page 1 stories"""
    per_page = 20
    all_stories = story_bus.get_all_stories()
    total_stories = len(all_stories)
    total_pages = (total_stories + per_page - 1) // per_page
    page = 1

    start = 0
    end = per_page
    paginated_stories = all_stories[start:end]

    result = {
        "stories": paginated_stories,
        "total_pages": total_pages,
        "current_page": page
    }

    cache.set('stories_page_1', result)

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

@app.route('/stories/paginated', methods=['GET'])
def get_paginated_stories():
    """Get stories with pagination. Cache only page 1."""
    page = int(request.args.get('page', 1))
    per_page = 12

    # Nếu là page 1 và đã cache sẵn
    if page == 1:
        cached_data = cache.get('stories_page_1')
        if cached_data:
            return jsonify(cached_data), 200

    all_stories = story_bus.get_all_stories()
    total_stories = len(all_stories)
    total_pages = (total_stories + per_page - 1) // per_page

    if page < 1 or page > total_pages:
        return jsonify({"error": "Page out of range"}), 400

    start = (page - 1) * per_page
    end = start + per_page
    paginated_stories = all_stories[start:end]

    result = {
        "stories": paginated_stories,
        "total_pages": total_pages,
        "current_page": page
    }

    # Cache riêng page 1
    if page == 1:
        cache.set('stories_page_1', result)

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
    limit = request.args.get('limit', default=None, type=int)

    stories = story_bus.get_stories_by_status(status, limit)
    if stories:
        return jsonify(stories), 200
    return jsonify({"error": "No stories found with the given status"}), 404

if __name__ == '__main__':
    app.run(debug=True)
