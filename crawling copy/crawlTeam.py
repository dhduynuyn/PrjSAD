import os
import psycopg2
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
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

# Crawl trang người dùng
url = "https://www.monkeyd.com.vn/nhom-dich/40075"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# Lấy thông tin
username = soup.select_one(".card-title").text.strip()
description = soup.select_one(".description").text.strip()
profile_image_url = soup.select_one(".img-fluid")["src"]

# Lấy follows và views từ các thẻ <div class="mb-1">
info_blocks = soup.select("div.more-info.mt-2 div.mb-1")
follows = views = 0

for div in info_blocks:
    label = div.select_one("b")
    if not label:
        continue
    label_text = label.text.strip()
    value_text = div.text.replace(label_text, "").strip().replace(",", "")
    if "theo dõi" in label_text:
        follows = int(value_text)
    elif "xem" in label_text:
        views = int(value_text)

# Tải ảnh đại diện
profile_image = requests.get(profile_image_url).content


# Lưu vào PostgreSQL
# cursor.execute("""
#     INSERT INTO public."user" (username, password, profile_image, gmail, description, follows, views)
#     VALUES (%s, %s, %s, %s, %s, %s, %s)
# """, (
#     username,
#     psycopg2.Binary(hashed_password),
#     psycopg2.Binary(profile_image),
#     gmail,
#     description,
#     follows,
#     views
# ))
print(username, description, follows, views)
#conn.commit()
print("✅ Đã lưu thông tin người dùng.")

cursor.close()
conn.close()
