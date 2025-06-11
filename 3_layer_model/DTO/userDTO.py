import base64
from datetime import datetime, timezone, date
import pytz

class UserDTO:
    def __init__(self, user_id=None, username=None, gmail=None, password=None, profile_image=None, follows=None, views=None, description=None, stories_id=None, follow_story=None):
        self.user_id = user_id
        self.username = username
        self.gmail = gmail
        self.password = password
        self.profile_image = profile_image
        self.description = description
        self.follows = follows
        self.views = views
        self.stories_id = stories_id if stories_id is not None else []
        self.follow_story = follow_story if follow_story is not None else []

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "gmail": self.gmail,
            "password": self.password,
            "profile_image": base64.b64encode(self.profile_image).decode('utf-8') if self.profile_image else None,
            "description": self.description,
            "follows": self.follows,
            "views": self.views,
            "stories_id": self.stories_id,
            "follow_story": self.follow_story
        }
