from DAO.DataProvider import Database
from DTO.userDTO import UserDTO

class UserDAO:
    def __init__(self):
        self.db = Database()

    def login(self, gmail, password):
        """ Check user credentials and return a UserDTO if found. """
        query = 'SELECT user_id, username, gmail FROM public."Users" WHERE gmail=%s AND password=%s'
        result = self.db.execute_query(query, (gmail, password))
        return UserDTO(*result[0]) if result else None

    def signup(self, gmail, password, username):
        """ Register a new user. """
        query = 'INSERT INTO public."Users" (gmail, password, username) VALUES (%s, %s, %s)'
        return self.db.execute_non_query(query, (gmail, password, username))