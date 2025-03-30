from flask import Flask, request, jsonify
from BUS.storycategoryBUS import StoryCategoryBUS

app = Flask(__name__)
category_bus = StoryCategoryBUS()

@app.route('/categories', methods=['GET'])
def get_all_categories():
    """Get all story categories"""
    categories = category_bus.get_all_categories()
    return jsonify([{
        "id": category.id,
        "categoryName": category.categoryName,
        "description": category.description
    } for category in categories]), 200

@app.route('/categories/<int:category_id>', methods=['GET'])
def get_category_by_id(category_id):
    """Get a category by ID"""
    category = category_bus.get_category_by_id(category_id)
    if category:
        return jsonify({
            "id": category.id,
            "categoryName": category.categoryName,
            "description": category.description
        }), 200
    return jsonify({"error": "Category not found"}), 404

@app.route('/categories', methods=['POST'])
def add_category():
    """Add a new category"""
    data = request.json
    category_name = data['categoryName']
    description = data.get('description', '')  # Default to an empty string if not provided

    category_id = category_bus.add_category(category_name, description)
    return jsonify({"message": "Category added successfully", "category_id": category_id}), 201

@app.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update an existing category"""
    data = request.json
    success = category_bus.update_category(category_id, data['categoryName'], data['description'])
    if success:
        return jsonify({"message": "Category updated successfully"}), 200
    return jsonify({"error": "Category not found"}), 404

@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category by ID"""
    success = category_bus.delete_category(category_id)
    if success:
        return jsonify({"message": "Category deleted successfully"}), 200
    return jsonify({"error": "Category not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
