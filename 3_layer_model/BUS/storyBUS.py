from DAO.storyDAO import StoryDAO
from datetime import datetime, timedelta

class StoryBUS:
    def __init__(self):
        self.dao = StoryDAO()
        self._cached_stories = None
        self._cache_expiry = None
        self.CACHE_DURATION = timedelta(minutes=10)  # cache trong 10 phút

    def get_all_stories(self, force=False):
        """Get all stories"""
        now = datetime.now()
        stories = []
        if force or self._cached_stories is None or self._cache_expiry is None or now > self._cache_expiry:
            # Cache hết hạn hoặc chưa có
            print("Fetching stories from story_bus...")
            stories = self.dao.get_all_stories()
            print(f"Fetched {len(stories)} stories from database.")
            self._cache_expiry = now + self.CACHE_DURATION
            self._cached_stories = [story.to_dict() for story in stories]
        else:
            print("Using cached stories...")
    
        return self._cached_stories
    
    def get_chapters_by_story_slug(self, story_slug):
        story = self.dao.get_story_by_id(story_slug)
        return story.chapters

    def get_story_by_id(self, story_id):
        """Get a story by ID"""
        story = self.dao.get_story_by_id(story_id)
        return story.to_dict2() if story else None
    
    def get_chapter_by_id(self, story_id):
        """Get a story by ID"""
        chapter = self.dao.get_chapter_by_id(story_id)
        return chapter if chapter else None

    def add_story(self, title, author, category, status, description=None):
        """Add a new story"""
        return self.dao.add_story(title, author, category, status, description)

    def update_story(self, story_id, title, author, category, status, description):
        """Update a story"""
        return self.dao.update_story(story_id, title, author, category, status, description)

    def delete_story(self, story_id):
        """Delete a story"""
        return self.dao.delete_story(story_id)
    
    def get_stories_by_status(self, status, limit=20):
        # Ví dụ giả sử self.stories là danh sách các dict truyện
        stories = self.dao.get_stories_by_status(status, limit)
        return [story.to_dict() for story in stories]

    def update_story_favorites(self, story):
        """Update story favorite status"""
        return self.dao.update_story_favorite(story)
    
    def update_story_follows(self, story):
        """Update story favorite status"""
        return self.dao.update_story_follow(story)
    
    def get_categories(self):
        return self.dao.get_categories()
    
    def get_categories_by_defined(self, defined):
        return self.dao.get_categories_by_defined(defined)
    
    def get_stories_id_by_category(self, category_id):
        """Get stories by category ID"""
        return self.dao.get_stories_id_by_category(category_id)