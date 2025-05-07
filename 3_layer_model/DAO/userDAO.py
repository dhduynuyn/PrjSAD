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
    
    
    def get_story_status_for_user(self, user_id, story_slug):
        query_user = 'SELECT like_story, follow_story FROM public."Users" WHERE user_id = %s'
        user_result = self.db.execute_query(query_user, (user_id,))
        if not user_result:
            return None  # Không tìm thấy người dùng

        like_story, follow_story = user_result[0]

        # Step 3: Kiểm tra xem story_id có nằm trong 2 mảng không
        is_favorited = story_slug in like_story if like_story else False
        is_bookmarked = story_slug in follow_story if follow_story else False

        return {
            "isFavorited": is_favorited,
            "isBookmarked": is_bookmarked
        }