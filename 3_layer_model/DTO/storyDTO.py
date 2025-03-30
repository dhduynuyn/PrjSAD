class StoryDTO:
    def __init__(self, story_id, title, author, category, status, description, views=0, likes=0, follows=0, last_updated=None):
        self.story_id = story_id
        self.title = title
        self.author = author
        self.category = category  # This will be a list of category IDs
        self.status = status
        self.description = description
        self.views = views
        self.likes = likes
        self.follows = follows
        self.last_updated = last_updated

    def to_dict(self):
        return {
            "id": self.story_id,
            "title": self.title,
            "author": self.author,
            "category": self.category,  # Keep as a list
            "status": self.status,
            "description": self.description,
            "views": self.views,
            "likes": self.likes,
            "follows": self.follows,
            "last_updated": self.last_updated
        }
