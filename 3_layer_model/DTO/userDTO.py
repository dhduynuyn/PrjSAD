class UserDTO:
    def __init__(self, user_id=None, username=None, password=None, full_name=None, user_type=None):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.full_name = full_name
        self.user_type = user_type