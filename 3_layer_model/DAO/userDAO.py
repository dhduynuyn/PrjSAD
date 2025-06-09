from DAO.DataProvider import Database
from DTO.userDTO import UserDTO

class UserDAO:
    def __init__(self):
        self.db = Database()

    def login(self, gmail, password):
        """ Check user credentials and return a UserDTO if found. """
        query = 'SELECT user_id, username, gmail FROM public."Users" WHERE gmail=%s AND password=%s'
        result = self.db.execute_query(query, (gmail, password))
        # print(result)
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
        story_slug = int(story_slug)

        # Step 3: Kiểm tra xem story_id có nằm trong 2 mảng không
        is_favorited = story_slug in like_story if like_story else False
        is_bookmarked = story_slug in follow_story if follow_story else False

        return {
            "isFavorited": is_favorited,
            "isBookmarked": is_bookmarked
        }
        
    def add_favorite(self, user_id, story_id):
        """Thêm story_id vào like_story, không kiểm tra gì cả"""
        query = '''
            UPDATE public."Users"
            SET like_story = array_append(like_story, %s)
            WHERE user_id = %s
        '''
        self.db.execute_non_query(query, (story_id, user_id))
        return True

    def add_follow(self, user_id, story_id):
        """Thêm story_id vào like_story, không kiểm tra gì cả"""
        query = '''
            UPDATE public."Users"
            SET follow_story = array_append(follow_story, %s)
            WHERE user_id = %s
        '''
        self.db.execute_non_query(query, (story_id, user_id))
        return True
    
    def get_all_user(self, force=False):
        """Lấy toàn bộ danh sách người dùng kèm theo stories_id (lấy từ bảng Story)"""
        # 1. Truy vấn toàn bộ user
        user_query = '''
            SELECT user_id, username, gmail, password, profile_image, follows, views, description
            FROM public."Users"
        '''
        users_raw = self.db.execute_query(user_query)

        # 2. Truy vấn tất cả story_id và team
        story_query = '''
            SELECT id, team
            FROM public."Story"
        '''
        stories_raw = self.db.execute_query(story_query)

        # 3. Build mapping: user_id -> [story_id,...]
        user_stories_map = {}
        for story_id, team in stories_raw:
            if team:
                for user_id in team:
                    user_stories_map.setdefault(user_id, []).append(story_id)

        # 4. Tạo danh sách UserDTO
        users = []
        for row in users_raw:
            user_id = row[0]
            stories_id = user_stories_map.get(user_id, [])
            user = UserDTO(
                user_id=user_id,
                username=row[1],
                gmail=row[2],
                password=row[3],
                profile_image=row[4],
                follows=row[5],
                views=row[6],
                description=row[7],
                stories_id=stories_id
            )
            users.append(user)

        return users
