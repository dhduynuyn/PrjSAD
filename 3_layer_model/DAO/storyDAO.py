from DAO.DataProvider import Database
from DTO.storyDTO import StoryDTO
import json

class StoryDAO:
    def __init__(self):
        self.db = Database()

    def get_all_stories(self):
        """Fetch all stories from the database"""
        query = '''SELECT id, title, author, category, state, description, views, likes, follows, last_updated 
                   FROM public."Story"'''
        results = self.db.execute_query(query)
        
        stories = []
        for row in results:
            story = StoryDTO(*row)
            stories.append(story)
        return stories

    def get_story_by_id(self, story_id):
        """Fetch a story by ID"""
        query = '''SELECT id, title, author, category, state, description, views, likes, follows, last_updated 
                   FROM public."Story" WHERE id = %s'''
        result = self.db.execute_query(query, (story_id,))
        
        if result:
            row = result[0]
            return StoryDTO(*row)
        return None

    def get_stories_by_status(self, status):
        """Fetch stories by status"""
        query = '''SELECT s.id, s.title, s.author, s.category, s.state, s.description, 
                    s.views, s.likes, s.follows, s.last_updated, s.image_data,
                    c.title AS latest_chapter
                FROM public."Story" s
                LEFT JOIN LATERAL (
                    SELECT title FROM public."Chapter"
                    WHERE storyid = s.id
                    ORDER BY chapterid DESC
                    LIMIT 1
                ) c ON true
                WHERE s.state = %s
                ORDER BY s.last_updated DESC'''
        results = self.db.execute_query(query, (status,))
        
        stories = []
        for row in results:
            story = StoryDTO(*row)
            stories.append(story)
        return stories
    
    def add_story(self, title, author, category, status, description):
        """Add a new story"""
        query = '''
            INSERT INTO public."Story" (title, author, category, views, likes, follows, state, description, last_updated)
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
            SET title = %s, author = %s, category = %s, state = %s, description = %s, last_updated = NOW()
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
    
