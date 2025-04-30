import json
import requests
from bs4 import BeautifulSoup
import psycopg2
from dotenv import load_dotenv
import psycopg2
import os
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

def download_image(url):
    response = requests.get(url)
    return response.content if response.status_code == 200 else None


# Đọc file JSON
with open("stories.json", "r", encoding="utf-8") as f:
    stories = json.load(f)

headers = {
    "User-Agent": "Mozilla/5.0"
}

for story_id, story in stories.items():
    url = story["url"]
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        # Image
        image_tag = soup.select_one("div.m-3.text-center img")
        image_url = image_tag["src"] if image_tag else None

        # Thể loại (genre)
        genre_dd = soup.select_one('dt:contains("Thể loại") + dd')
        genres = [a.text.strip() for a in genre_dd.select("a")] if genre_dd else []

        # Views, Favorites, Follows
        def get_text_after_dt(label):
            el = soup.find("dt", string=lambda s: s and label in s)
            return el.find_next_sibling("dd").get_text(strip=True) if el else ''

        views = get_text_after_dt("Lượt xem")
        views = int(views.replace(",", ""))
        
        likes = get_text_after_dt("Yêu thích")
        likes = int(likes.replace(",", ""))
        follows = get_text_after_dt("Lượt theo dõi")
        follows = int(follows.replace(",", ""))
        story_id = int(story_id)

        # Team IDs
        team_dd = soup.select_one('dt:contains("Team") + dd')
        team_urls = [a['href'] for a in team_dd.select("a")] if team_dd else []
        team_ids = [int(url.rstrip("/").split("/")[-1]) for url in team_urls]

        # In thử để debug
        print(f"{story_id} | | Genres: {genres} | Views: {views} | Favorites: {likes} | Follows: {follows} | Teams: {team_ids}")

        # Lưu vào DB (giả sử có bảng story_extra)
        cursor.execute("""
            UPDATE public."Story"
            SET genres = %s, views = %s, likes = %s, follows = %s, team = %s
            WHERE id = %s
        """, (
            genres,       # Các giá trị genres (TEXT[]), views, likes, follows, team_ids cần cập nhật
            views,
            likes,
            follows,
            team_ids,
            id      # story_id để chỉ định bản ghi nào sẽ được cập nhật
        ))

        conn.commit()

    except Exception as e:
        print(f"❌ Lỗi khi xử lý {url}: {e}")

# Đóng kết nối
cursor.close()
conn.close()
