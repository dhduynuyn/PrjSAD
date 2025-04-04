from DAO.storyDAO import StoryDAO

class StoryBUS:
    def __init__(self):
        self.dao = StoryDAO()

    def get_all_stories(self):
        """Get all stories"""
        return [story.to_dict() for story in self.dao.get_all_stories()]

    def get_story_by_id(self, story_id):
        """Get a story by ID"""
        story = self.dao.get_story_by_id(story_id)
        return story.to_dict() if story else None

    def add_story(self, title, author, category, status, description=None):
        """Add a new story"""
        return self.dao.add_story(title, author, category, status, description)

    def update_story(self, story_id, title, author, category, status, description):
        """Update a story"""
        return self.dao.update_story(story_id, title, author, category, status, description)

    def delete_story(self, story_id):
        """Delete a story"""
        return self.dao.delete_story(story_id)
