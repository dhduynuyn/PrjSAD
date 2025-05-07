from DAO.userDAO import UserDAO

class UserBUS:
    def __init__(self):
        self.user_dao = UserDAO()

    def login(self, gmail, password):
        """Handles user login."""
        return self.user_dao.login(gmail, password)

    def signup(self, gmail, password, username):
        """Handles user signup."""
        return self.user_dao.signup(gmail, password, username)
    
    def get_story_status_for_user(self, user_id, story_slug):
        """Checks if a story is liked or followed by the user."""
        return self.user_dao.get_story_status_for_user(user_id, story_slug)