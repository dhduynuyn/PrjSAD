from DAO.DataProvider import Database
from DTO.storyDTO import StoryDTO
import json

class StoryDAO:
    def __init__(self):
        self.db = Database()

    def get_all_stories(self):
        """Fetch all stories from the database"""
        query = '''SELECT id, title, author, category, status, description, views, likes, follows, last_updated 
                   FROM public."Story"'''
        results = self.db.execute_query(query)
        
        stories = []
        for row in results:
            story = StoryDTO(
                story_id=row[0],
                title=row[1],
                author=row[2],
                category=row[3],  # Convert stored JSON string to a list
                status=row[4],
                description=row[5],
                views=row[6],
                likes=row[7],
                follows=row[8],
                last_updated=row[9]
            )
            stories.append(story)
        return stories

    def get_story_by_id(self, story_id):
        """Fetch a story by ID"""
        query = '''SELECT id, title, author, category, status, description, views, likes, follows, last_updated 
                   FROM public."Story" WHERE id = %s'''
        result = self.db.execute_query(query, (story_id,))
        
        if result:
            row = result[0]
            return StoryDTO(
                story_id=row[0],
                title=row[1],
                author=row[2],
                category=row[3],  # Convert JSON string to list
                status=row[4],
                description=row[5],
                views=row[6],
                likes=row[7],
                follows=row[8],
                last_updated=row[9]
            )
        return None

    def add_story(self, title, author, category, status, description):
        """Add a new story"""
        query = '''
            INSERT INTO public."Story" (title, author, category, views, likes, follows, status, description, last_updated)
            VALUES (%s, %s, %s, 0, 0, 0, %s, %s, NOW())
            RETURNING id
        '''
        # Convert Python list to PostgreSQL array string format
        if isinstance(category, list):
            category_str = '{' + ','.join(str(c) for c in category) + '}'
        else:
            category_str = '{' + str(category) + '}'
            
        result = self.db.execute_query(query, (title, author, category_str, status, description))
        return result[0][0] if result else None

    def update_story(self, story_id, title, author, category, status, description):
        """Update an existing story"""
        query = '''
            UPDATE public."Story"
            SET title = %s, author = %s, category = %s, status = %s, description = %s, last_updated = NOW()
            WHERE id = %s
        '''
                
        # Convert Python list to PostgreSQL array string format
        if isinstance(category, list):
            category_str = '{' + ','.join(str(c) for c in category) + '}'
        else:
            category_str = '{' + str(category) + '}'
            
        return self.db.execute_non_query(query, (title, author, category_str, status, description, story_id))

    def delete_story(self, story_id):
        """Delete a story by ID"""
        query = '''DELETE FROM public."Story" WHERE id = %s'''
        return self.db.execute_non_query(query, (int(story_id),))
