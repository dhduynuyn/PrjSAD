from flask import Flask, request, jsonify
from BUS.storyBUS import StoryBUS

app = Flask(__name__)
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

if __name__ == '__main__':
    app.run(debug=True)
