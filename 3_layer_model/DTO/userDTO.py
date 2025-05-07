class UserDTO:
    def __init__(self, user_id=None, username=None, gmail=None,  password=None, profile_image=None, follows=None, views=None, description=None):
        self.user_id = user_id
        self.username = username
        self.gmail = gmail
        self.password = password
        self.profile_image = profile_image
        self.description = description
        self.follows = follows
        self.views = views