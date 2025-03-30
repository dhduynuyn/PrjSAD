from DAO.DataProvider import Database
from DTO.storycategoryDTO import StoryCategoryDTO

class StoryCategoryDAO:
    def __init__(self):
        """Initialize database connection"""
        self.db = Database()

    def get_all_categories(self):
        """Fetch all story categories from the database"""
        query = 'SELECT id, categoryName, description FROM public."StoryCategory"'
        result = self.db.execute_query(query)
        return [StoryCategoryDTO(*row) for row in result] if result else []

    def get_category_by_id(self, category_id):
        """Fetch a specific category by its ID"""
        query = 'SELECT id, categoryName, description FROM public."StoryCategory" WHERE id = %s'
        result = self.db.execute_query(query, (category_id,))
        return StoryCategoryDTO(*result[0]) if result else None

    def get_category_by_name(self, category_name):
        """Fetch a specific category by its name"""
        query = 'SELECT id, categoryName, description FROM public."StoryCategory" WHERE categoryName = %s'
        result = self.db.execute_query(query, (category_name,))
        return StoryCategoryDTO(*result[0]) if result else None

    def add_category(self, categoryname, description):
        """Insert a new category into the database"""
        query = 'INSERT INTO public."StoryCategory" (categoryName, description) VALUES (%s, %s)'
        return self.db.execute_non_query(query, (categoryname, description))

    def update_category(self, category, categoryname, description):
        """Update an existing category"""
        query = 'UPDATE public."StoryCategory" SET categoryName = %s, description = %s WHERE id = %s'
        return self.db.execute_non_query(query, (categoryname, description, category))

    def delete_category(self, category):
        """Delete a category by ID"""
        query = 'DELETE FROM public."StoryCategory" WHERE id = %s'
        return self.db.execute_non_query(query, (category,))
