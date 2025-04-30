import os
import json
import psycopg2
import requests
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Kết nối DB
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)
cursor = conn.cursor()

# Mở file stories.json
with open("stories.json", "r", encoding="utf-8") as f:
    stories = json.load(f)

visited_group_ids = set()  # Tránh trùng group trong nhiều stories

for index, story in stories.items():
    groups = story.get("groups", [])
    for group_url in groups:
        try:
            group_id = int(group_url.strip().split("/")[-1])

            if group_id in visited_group_ids:
                continue
            visited_group_ids.add(group_id)

            # Kiểm tra xem group đã có trong DB chưa
            cursor.execute('SELECT 1 FROM public."Users" WHERE user_id = %s', (group_id,))
            if cursor.fetchone():
                print(f"⏭️ Bỏ qua group {group_url} (đã tồn tại).")
                continue

            print(f"Đang xử lý group {group_url}...")

            response = requests.get(group_url, timeout=10)
            if response.status_code != 200:
                print(f"❌ Không thể truy cập group {group_url} (HTTP {response.status_code})")
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            # Lấy username
            username_tag = soup.select_one(".card-title")
            if not username_tag:
                print(f"❌ Group {group_url} không có username (có thể đã bị xóa).")
                continue
            username = username_tag.text.strip()

            # Description (có thể không có)
            desc_tag = soup.select_one(".description")
            description = desc_tag.text.strip() if desc_tag else ""

            # Profile image
            profile_img_tag = soup.select_one(".img-fluid")
            profile_image_url = profile_img_tag["src"] if profile_img_tag else None
            profile_image = requests.get(profile_image_url).content if profile_image_url else None

            # Follows & Views
            follows = 0
            views = 0
            info_block = soup.select_one(".more-info.mt-2")
            if info_block:
                info_items = info_block.select("div.mb-1")
                for item in info_items:
                    text = item.text.strip()
                    if "Lượt theo dõi" in text:
                        follows = int(re.search(r"\d[\d,]*", text).group().replace(",", ""))
                    elif "Lượt xem" in text:
                        views = int(re.search(r"\d[\d,]*", text).group().replace(",", ""))

            # Lưu vào DB
            cursor.execute("""
                INSERT INTO public."Users" (user_id, username, password, profile_image, gmail, description, follows, views)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                group_id,
                username,
                b"",  # password rỗng (hoặc có thể để None nếu cho phép)
                psycopg2.Binary(profile_image) if profile_image else None,
                "",  # gmail rỗng
                description,
                follows,
                views
            ))
            conn.commit()
            print(f"✅ Đã lưu group {group_id} - {username}")

        except Exception as e:
            conn.rollback()
            print(f"❌ Lỗi xử lý group {group_url}: {e}")

cursor.close()
conn.close()
