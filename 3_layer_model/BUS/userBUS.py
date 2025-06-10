from DAO.userDAO import UserDAO
from datetime import datetime, timedelta

class UserBUS:
    def __init__(self):
        self.user_dao = UserDAO()
        self._cached_users = None
        self._cache_expiry = None
        self.CACHE_DURATION = timedelta(minutes=10)  # cache trong 10 phút

    def login(self, gmail, password):
        """Handles user login."""
        return self.user_dao.login(gmail, password)

    def signup(self, gmail, password, username):
        """Handles user signup."""
        return self.user_dao.signup(gmail, password, username)
    
    def get_story_status_for_user(self, user_id, story_slug):
        """Checks if a story is liked or followed by the user."""
        return self.user_dao.get_story_status_for_user(user_id, story_slug)
    
    def add_favorite(self, user_id, story_id):
        """Adds a story to the user's favorites."""
        return self.user_dao.add_favorite(user_id, story_id)
    
    def add_follow(self, user_id, story_id):
        """Adds a story to the user's favorites."""
        return self.user_dao.add_follow(user_id, story_id)
    
    def remove_follow(self, user_id, story_id):
        """Adds a story to the user's favorites."""
        return self.user_dao.remove_follow(user_id, story_id)
    
    def get_category(self):
        """Retrieves all categories."""
        return self.user_dao.get_category()
    
    def get_all_user(self, force=False):
        """Get all users with optional cache"""
        now = datetime.now()

        if force or self._cached_users is None or self._cache_expiry is None or now > self._cache_expiry:
            print("Fetching users from database...")
            users = self.user_dao.get_all_user()
            self._cached_users = [user.to_dict() for user in users]
            self._cache_expiry = now + self.CACHE_DURATION
        else:
            print("Using cached users...")

        return self._cached_users
    
    def get_user_by_id(self, user_id):
        """Retrieves a user by their ID."""
        users = self.get_all_user()
        for user in users:
            if user.get('user_id') == user_id:
                return user
        return None
    
    def get_stories_by_user(self, user_id):
        return self.user_dao.get_stories_by_user(user_id)

