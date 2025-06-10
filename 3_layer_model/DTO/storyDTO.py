import base64
from datetime import datetime, timezone, date
import pytz

class TranslatorTeamDTO:
    def __init__(self, id, names):
        self.id = id
        self.name = ", ".join(names) if names else ""

class ChapterDTO:
    def __init__(self, slug, title, content, updated_at):
        self.slug = slug
        self.title = title
        self.content = content
        self.updated_at = updated_at

    def to_dict(self):
        return {
            'slug': self.slug,
            'title': self.title,
            'content': self.content,
            'updatedAt': self.updated_at,
        }
        
def humanize_time_diff(past_time):
    # Đặt múi giờ Việt Nam (Asia/Ho_Chi_Minh)
    vietnam_tz = pytz.timezone('Asia/Ho_Chi_Minh')
    
    if isinstance(past_time, datetime):
        # Chuyển đổi timezone nếu past_time là datetime mà không có timezone
        if past_time.tzinfo is None:
            past_time = vietnam_tz.localize(past_time)  # Gán timezone Việt Nam
        else:
            past_time = past_time.astimezone(vietnam_tz)  # Chuyển đổi sang timezone Việt Nam
    elif isinstance(past_time, date):  # Kiểm tra nếu là datetime.date
        past_time = datetime.combine(past_time, datetime.min.time())
        past_time = vietnam_tz.localize(past_time)  # Thêm timezone Việt Nam

    # Lấy thời gian hiện tại ở múi giờ Việt Nam
    now = datetime.now(vietnam_tz)
    diff = now - past_time

    seconds = int(diff.total_seconds())
    if seconds < 60:
        return f"{seconds} giây trước"
    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes} phút trước"
    elif seconds < 86400:
        hours = seconds // 3600
        return f"{hours} giờ trước"
    else:
        days = seconds // 86400
        return f"{days} ngày trước"

class StoryDTO:
    def __init__(self, story_id, title, author, category, status, description,
                 views=0, likes=0, follows=0, last_updated=None, image_data=None, genres=None,
                 latest_chapter=None, team_ids=None, team_names=None, chapters=None, comments=None):
        self.story_id = story_id
        self.title = title
        self.author = author
        self.category = category
        self.status = status
        self.description = description
        self.views = views
        self.likes = likes
        self.follows = follows
        self.last_updated = last_updated
        self.genres = genres if genres else []
        self.image_data = image_data
        self.latest_chapter = latest_chapter
        self.chapters = chapters
        self.comments = comments if comments else []

        if team_ids and team_names:
            self.translatorTeam = TranslatorTeamDTO(team_ids[0], team_names)
        else:
            self.translatorTeam = None

    def to_dict(self):
        return {
            "id": self.story_id,
            "title": self.title,
            "author": self.author,
            "category": self.category,
            "status": self.status,
            "description": self.description,
            "views": self.views if self.views is not None else 0,
            "likes": self.likes if self.likes is not None else 0,
            "follows": self.follows if self.follows is not None else 0,
            "last_updated": humanize_time_diff(self.last_updated),
            "image_data": base64.b64encode(self.image_data).decode('utf-8') if self.image_data else None,
            "latest_chapter": self.latest_chapter,
            "translatorTeam": {
                "id": self.translatorTeam.id,
                "name": self.translatorTeam.name,
                "url": self.translatorTeam.id
            } if self.translatorTeam else None,
            "chapters": self.chapters,
            "comments": self.comments
        }

    def to_dict2(self):

        return {
            "id": self.story_id,
            "title": self.title,
            "author": {"name": self.author},
            "genres": self.genres,
            "status": self.status,
            "description": self.description,
            "views": self.views if self.views is not None else 0,
            "favorites": self.likes if self.likes is not None else 0,
            "followers": self.follows if self.follows is not None else 0,
            "last_updated": humanize_time_diff(self.last_updated),
            "image_data": base64.b64encode(self.image_data).decode('utf-8') if self.image_data else None,
            "latest_chapter": self.latest_chapter,
            "translatorTeam": {
                "id": self.translatorTeam.id,
                "name": self.translatorTeam.name,
                "url": self.translatorTeam.id
            } if self.translatorTeam else None,
            "chapters": self.chapters,
            "comments": self.comments
        }
