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