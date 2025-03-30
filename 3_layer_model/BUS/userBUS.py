from DAO.userDAO import UserDAO

class UserBUS:
    def __init__(self):
        self.user_dao = UserDAO()

    def login(self, username, password):
        """Handles user login."""
        return self.user_dao.login(username, password)

    def signup(self, username, password, full_name):
        """Handles user signup."""
        return self.user_dao.signup(username, password, full_name)