import base64
from datetime import datetime, timezone, date
import pytz

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
                 views=0, likes=0, follows=0, last_updated=None, image_data=None, latest_chapter=None):
        self.story_id = story_id
        self.title = title
        self.author = author
        self.category = category  # This will be a list of category IDs
        self.status = status
        self.description = description
        self.views = views
        self.likes = likes
        self.follows = follows
        self.last_updated = last_updated
        self.image_data = image_data  # Có thể None hoặc chuỗi base64
        self.latest_chapter = latest_chapter

    def to_dict(self):
        return {
            "id": self.story_id,
            "title": self.title,
            "author": self.author,
            "category": self.category,
            "status": self.status,
            "description": self.description,
            "views": self.views,
            "likes": self.likes,
            "follows": self.follows,
            "last_updated": humanize_time_diff(self.last_updated),
            "image_data": base64.b64encode(self.image_data).decode('utf-8') if self.image_data else None,
            "latest_chapter": self.latest_chapter
        }
