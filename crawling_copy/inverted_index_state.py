import psycopg2
from collections import defaultdict
import os
from dotenv import load_dotenv

# Tải biến môi trường từ file .env
load_dotenv()

# Kết nối PostgreSQL
connection_string = (
    f"host={os.getenv('DB_HOST')} "
    f"port={os.getenv('DB_PORT')} "
    f"dbname={os.getenv('DB_NAME')} "
    f"user={os.getenv('DB_USER')} "
    f"password={os.getenv('DB_PASSWORD')} "
    f"connect_timeout={os.getenv('DB_CONNECT_TIMEOUT', '10')}"  # fallback mặc định 10 giây
)

conn = psycopg2.connect(connection_string)
cur = conn.cursor()

# Bước 1: Lấy toàn bộ story (id, genres[])
cur.execute('SELECT id, state FROM public."Story";')
stories = cur.fetchall()

# Bước 2: Gom nhóm story_id theo category_name (thể loại)
category_to_stories = defaultdict(list)
for story_id, genre in stories:
    if genre is not None:
        category_to_stories[genre].append(story_id)

# Bước 3: Cập nhật bảng StoryCategory: gán danh sách story_ids vào cột `stories`
for category_name, story_ids in category_to_stories.items():
    cur.execute("""
        UPDATE public."StoryCategory"
        SET stories = %s
        WHERE categoryname = %s;
    """, (story_ids, category_name))

# Commit thay đổi và đóng kết nối
conn.commit()
cur.close()
conn.close()
print("✅ Cập nhật thành công!")
