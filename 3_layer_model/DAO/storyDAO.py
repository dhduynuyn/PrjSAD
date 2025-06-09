from DAO.DataProvider import Database
from DTO.storyDTO import StoryDTO
import json
import base64
from datetime import date
from flask import jsonify

class StoryDAO:
    def __init__(self):
        self.db = Database()

    def get_all_stories(self):
        """Fetch all stories from the database"""
        query = '''SELECT 
                    s.id, s.title, s.author, s.category, s.state, s.description, 
                    s.views, s.likes, s.follows, s.last_updated, s.image_data, s.genres,
                    c.title AS latest_chapter,
                    s.team AS team_ids,
                    ARRAY_REMOVE(ARRAY_AGG(u.username), NULL) AS team_names
                FROM public."Story" s
                LEFT JOIN LATERAL (
                    SELECT title FROM public."Chapter"
                    WHERE storyid = s.id
                    ORDER BY chapterid DESC
                    LIMIT 1
                ) c ON true
                LEFT JOIN public."Users" u ON u.user_id = ANY(s.team)
                GROUP BY s.id, c.title, s.team
                ORDER BY s.last_updated DESC;
                '''
        results = self.db.execute_query(query)
        
        stories = []
        for row in results:
            story = StoryDTO(*row)
            
            chapter_query = '''
                SELECT chapterid, title, last_updated
                FROM public."Chapter"
                WHERE storyid = %s
                ORDER BY chapterid ASC
            '''
            
            chapter_result = self.db.execute_query(chapter_query, (story.story_id,))

            columns = ['chapterid', 'title', 'created_at']

            story.chapters = []
            for row in chapter_result:
                row_dict = dict(zip(columns, row))
                story.chapters.append(row_dict)
            
            if story.chapters:
                latest = max(
                    story.chapters,
                    key=lambda c: (c['created_at'], c['chapterid'])
                )
                story.latest_chapter = latest['title']
            else:
                story.latest_chapter = None
            
            stories.append(story)
        return stories
    
    def get_story_by_id(self, story_id):
        """Fetch a story by ID, including team members and all chapters"""
        # Truy vấn thông tin truyện
        story_query = '''
            SELECT 
                s.id, s.title, s.author, s.category, s.state, s.description, 
                s.views, s.likes, s.follows, s.last_updated, s.image_data, s.genres,
                c.title AS latest_chapter,
                s.team AS team_ids,
                ARRAY_REMOVE(ARRAY_AGG(u.username), NULL) AS team_names
            FROM public."Story" s
            LEFT JOIN LATERAL (
                SELECT title FROM public."Chapter"
                WHERE storyid = s.id
                ORDER BY chapterid DESC
                LIMIT 1
            ) c ON true
            LEFT JOIN public."Users" u ON u.user_id = ANY(s.team)
            WHERE s.id = %s
            GROUP BY s.id, c.title
        '''
        story_result = self.db.execute_query(story_query, (story_id,))

        if not story_result:
            return None

        story_row = story_result[0]
        story_dto = StoryDTO(*story_row)
        

        # Truy vấn toàn bộ chương
        chapter_query = '''
            SELECT chapterid, title, content, last_updated, storyid
            FROM public."Chapter"
            WHERE storyid = %s
            ORDER BY chapterid ASC
        '''
        
        chapter_result = self.db.execute_query(chapter_query, (story_id,))

        columns = ['chapterid', 'title', 'content', 'created_at']

        story_dto.chapters = []
        for row in chapter_result:
            row_dict = dict(zip(columns, row))
            story_dto.chapters.append(row_dict)
            
        if story_dto.chapters:
            story_dto.latest_chapter = max(
                story_dto.chapters,
                key=lambda c: (c['created_at'], c['chapterid'])
            )
        else:
            story_dto.latest_chapter = None
            
        comments = self.get_enriched_comments(story_id)
        story_dto.comments = comments
        return story_dto


    def get_enriched_comments(self, story_id):
        # 1. Lấy raw comments jsonb
        comment_query = '''
            SELECT s.comments
            FROM public."Story" s
            WHERE s.id = %s
        '''
        result = self.db.execute_query(comment_query, (story_id,))
        if not result or not result[0][0]:
            return []

        comments = result[0][0]

        # 2. Thu thập tất cả user_id từ comments và replies đệ quy
        user_ids = set()

        def collect_user_ids(comment_list):
            for c in comment_list:
                if 'user_id' in c and c['user_id'] is not None:
                    user_ids.add(c['user_id'])
                if 'replies' in c and c['replies']:
                    collect_user_ids(c['replies'])

        collect_user_ids(comments)

        if not user_ids:
            return comments

        # 3. Truy vấn Users lấy thông tin
        user_query = '''
            SELECT user_id, username, profile_image
            FROM public."Users"
            WHERE user_id = ANY(%s)
        '''
        users_result = self.db.execute_query(user_query, (list(user_ids),))

        user_map = {}
        for row in users_result:
            uid, uname, pimg = row
            user_map[uid] = {
                'username': uname,
                'profile_image': base64.b64encode(pimg).decode('utf-8') if pimg else None
            }

        # 4. Đệ quy enrich comments với user info
        def enrich_comments(comment_list):
            for c in comment_list:
                uid = c.get('user_id')
                if uid and uid in user_map:
                    c['username'] = user_map[uid]['username']
                    c['profile_image'] = user_map[uid]['profile_image']
                else:
                    c['username'] = None
                    c['profile_image'] = None

                if 'replies' in c and c['replies']:
                    enrich_comments(c['replies'])

        enrich_comments(comments)
        
        return comments

    def get_chapter_by_id(self, story_id):
        """Fetch chapters by story ID and return as JSON"""
        query = '''SELECT chapterid, title, last_updated
                FROM public."Chapter"
                WHERE storyid = %s
                ORDER BY chapterid ASC'''
        
        result = self.db.execute_query(query, (story_id,))
        
        if result:
            chapters = [
                {
                    "slug": row[0],
                    "name": row[1],
                    "updatedAtISO": row[2]
                }
                for row in result
            ]
            return chapters
        return []

    def get_stories_by_status(self, status, limit=20):
        """Fetch stories by status"""
        query = '''SELECT s.id, s.title, s.author, s.category, s.state, s.description, 
                    s.views, s.likes, s.follows, s.last_updated, s.image_data, s.genres,
                    c.title AS latest_chapter
                FROM public."Story" s
                LEFT JOIN LATERAL (
                    SELECT title FROM public."Chapter"
                    WHERE storyid = s.id
                    ORDER BY chapterid DESC
                    LIMIT 1
                ) c ON true
                WHERE s.state = %s
                ORDER BY s.last_updated DESC
                LIMIT %s'''
        results = self.db.execute_query(query, (status,limit,))
        
        stories = []
        for row in results:
            story = StoryDTO(*row)
            stories.append(story)
        return stories
    
    def add_story(self, title, author, category, status, description):
        """Add a new story"""
        query = '''
            INSERT INTO public."Story" (title, author, category, views, likes, follows, state, description, last_updated)
            VALUES (%s, %s, %s, 0, 0, 0, %s, %s, NOW())
            RETURNING id
        '''
        # Convert Python list to PostgreSQL array string format
        if isinstance(category, list):
            category_str = '{' + ','.join(str(c) for c in category) + '}'
        else:
            category_str = '{' + str(category) + '}'
            
        result = self.db.execute_query(query, (title, author, category_str, status, description))
        return result[0][0] if result else None

    def update_story(self, story_id, title, author, category, status, description):
        """Update an existing story"""
        query = '''
            UPDATE public."Story"
            SET title = %s, author = %s, category = %s, state = %s, description = %s, last_updated = NOW()
            WHERE id = %s
        '''
                
        # Convert Python list to PostgreSQL array string format
        if isinstance(category, list):
            category_str = '{' + ','.join(str(c) for c in category) + '}'
        else:
            category_str = '{' + str(category) + '}'
            
        return self.db.execute_non_query(query, (title, author, category_str, status, description, story_id))

    def delete_story(self, story_id):
        """Delete a story by ID"""
        query = '''DELETE FROM public."Story" WHERE id = %s'''
        return self.db.execute_non_query(query, (int(story_id),))

    def increase_view(self, story_id):
        """Increase the view count for a story for today's date"""
        today = date.today()

        # Kiểm tra xem dòng đã tồn tại chưa
        check_query = '''
            SELECT view_count FROM public.story_view_stats
            WHERE story_id = %s AND view_date = %s
        '''
        result = self.db.execute_query(check_query, (story_id, today))

        if result:
            # Nếu có rồi, tăng thêm 1
            update_query = '''
                UPDATE public.story_view_stats
                SET view_count = view_count + 1
                WHERE story_id = %s AND view_date = %s
            '''
            self.db.execute_non_query(update_query, (story_id, today))
        else:
            # Nếu chưa có, tạo mới
            insert_query = '''
                INSERT INTO public.story_view_stats (story_id, view_date, view_count)
                VALUES (%s, %s, 1)
            '''
            self.db.execute_non_query(insert_query, (story_id, today))
            
    def update_story_favorite(self, story):
        """Update story favorite status"""
        query = '''
            UPDATE public."Story"
            SET likes = %s
            WHERE id = %s
        '''
        self.db.execute_non_query(query, (story['favorites'], story['id']))
        return True
    
    def update_story_follow(self, story):
        """Update story favorite status"""
        query = '''
            UPDATE public."Story"
            SET follows = %s
            WHERE id = %s
        '''
        self.db.execute_non_query(query, (story['followers'], story['id']))
        return True
    
    def get_categories(self):
        """Fetch stories by status"""
        query = '''SELECT id, categoryname
                FROM public."StoryCategory" '''
        results = self.db.execute_query(query)

        categories = [
            {
                "id": row[0],
                "label": row[1]    
            } for row in results
        ]
        return categories
    
    def get_categories_by_defined(self, defined):
        """Fetch stories by status"""
        query = '''SELECT id, categoryname
                FROM public."StoryCategory" 
                WHERE user_defined = %s'''
        results = self.db.execute_query(query, (defined,))

        # print(results)
        
        categories = [
            {
                "id": row[0],
                "label": row[1]    
            } for row in results
        ]
        return categories
    
    def get_stories_id_by_category(self, category_id):
        """Get stories by category ID"""
        query = '''SELECT stories
                FROM public."StoryCategory"
                WHERE id = %s'''
        
        results = self.db.execute_query(query, (category_id,))
        
        stories = results[0][0] if results else None
        return stories