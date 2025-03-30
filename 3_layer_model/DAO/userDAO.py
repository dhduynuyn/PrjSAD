from DAO.DataProvider import Database
from DTO.userDTO import UserDTO

class UserDAO:
    def __init__(self):
        self.db = Database()

    def login(self, username, password):
        """ Check user credentials and return a UserDTO if found. """
        query = 'SELECT user_id, username, password, full_name FROM public."Users" WHERE username=%s AND password=%s'
        result = self.db.execute_query(query, (username, password))
        return UserDTO(*result[0]) if result else None

    def signup(self, username, password, full_name):
        """ Register a new user. """
        query = 'INSERT INTO public."Users" (username, password, full_name) VALUES (%s, %s, %s)'
        return self.db.execute_non_query(query, (username, password, full_name))