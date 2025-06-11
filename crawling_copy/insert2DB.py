import json
import psycopg2
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

# Kết nối PostgreSQL
connection_string = (
    f"host={os.getenv('DB_HOST')} "
    f"port={os.getenv('DB_PORT')} "
    f"dbname={os.getenv('DB_NAME')} "
    f"user={os.getenv('DB_USER')} "
    f"password={os.getenv('DB_PASSWORD')} "
    f"connect_timeout={os.getenv('DB_CONNECT_TIMEOUT')} "
)

conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

cur = conn.cursor()

# Đọc file JSON
with open('stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

# Duyệt từng story và insert
# for story_id, story in stories.items():
#     title = story.get('title', '')
#     print(title)
#     author = story.get('author', '')
#     description = story.get('description', '')
#     state = story.get('state', '')

#     sql = """
#     INSERT INTO public."Story" (id, title, author, description, state, last_updated)
#     VALUES (%s, %s, %s, %s, %s, NOW())
#     ON CONFLICT (id) DO UPDATE 
#     SET title = EXCLUDED.title,
#         author = EXCLUDED.author,
#         description = EXCLUDED.description,
#         state = EXCLUDED.state,
#         last_updated = NOW()
#     ;
#     """

#     cursor.execute(sql, (int(story_id), title, author, description, state))

# # Commit thay đổi
# conn.commit()

# # Đóng kết nối
# cursor.close()
# conn.close()

# for story_id, story in stories.items():
#     chapters = story.get('chapters', [])
    
#     for chapter in chapters:
#         chapter_title = chapter.get('title', '').strip()
#         chapter_content = chapter.get('content', '').strip()

#         sql = """
#             INSERT INTO public."Chapter" (storyid, title, content, last_updated)
#             VALUES (%s, %s, %s, NOW())
#             ON CONFLICT DO NOTHING; -- Nếu cần tránh insert trùng
#         """
#         cursor.execute(sql, (int(story_id), chapter_title, chapter_content))

# conn.commit()
# cursor.close()
# conn.close()
# print("✅ Insert chapters thành công!")

# print("Insert stories thành công!")

# Duyệt từng câu chuyện và insert chapter
for story_id, story in stories.items():
    chapters = story.get('chapters', [])
    
    # Đảo ngược thứ tự chapters
    chapters.reverse()
    
    chapterid = 1  # Khởi tạo chapterid cho mỗi story

    for chapter in chapters:
        chapter_title = chapter.get('title', '').strip()
        chapter_content = chapter.get('content', '').strip()

        sql = """
            INSERT INTO public."Chapter" (storyid, chapterid, title, content, last_updated)
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT DO NOTHING; -- Nếu cần tránh insert trùng
        """
        cursor.execute(sql, (int(story_id), chapterid, chapter_title, chapter_content))
        chapterid += 1  # Tăng chapterid cho chương tiếp theo

conn.commit()
cursor.close()
conn.close()

print("✅ Insert chapters thành công!")