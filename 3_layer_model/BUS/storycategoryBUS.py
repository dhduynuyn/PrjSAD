from DAO.storycategoryDAO import StoryCategoryDAO
from DTO.storycategoryDTO import StoryCategoryDTO

class StoryCategoryBUS:
    def __init__(self):
        """Initialize the StoryCategoryBUS with DAO instance"""
        self.dao = StoryCategoryDAO()

    def get_all_categories(self):
        """Retrieve all story categories"""
        return self.dao.get_all_categories()

    def get_category_by_id(self, category_id):
        """Retrieve a category by its ID"""
        return self.dao.get_category_by_id(category_id)

    def get_category_by_name(self, category_name):
        """Retrieve a category by its Name"""
        return self.dao.get_category_by_name(category_name)

    def add_category(self, category_name, description):
        """Add a new category and return its ID"""
        return self.dao.add_category(category_name, description)

    def update_category(self, category_id, category_name, description):
        """Update an existing category"""
        return self.dao.update_category(category_id, category_name, description)

    def delete_category(self, category_id):
        """Delete a category by ID"""
        return self.dao.delete_category(category_id)
