import os
import json
import psycopg2
import requests
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Load biến môi trường
load_dotenv()

# Kết nối PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    connect_timeout=int(os.getenv("DB_CONNECT_TIMEOUT", 10))
)
cursor = conn.cursor()

# Cấu hình Chrome
chrome_options = Options()
chrome_options.add_argument("--headless=new")
driver = webdriver.Chrome(options=chrome_options)

# Đọc danh sách truyện
with open("stories.json", "r", encoding="utf-8") as f:
    stories = json.load(f)

headers = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://monkeyd.net.vn/"
}

for index, story in stories.items():
    print(f"Đang xử lý câu chuyện {index}...")

    try:
        driver.get(story["url"])
        driver.implicitly_wait(5)

        # Lấy link ảnh từ <img>
        image_element = driver.find_element(By.CSS_SELECTOR, "div.m-3.text-center img")
        image_url = image_element.get_attribute("src")

        # Gửi request lấy ảnh (giả lập trình duyệt thật)
        response = requests.get(image_url, headers=headers, timeout=10)
        if response.status_code == 200:
            image_data = response.content

            # Lưu vào PostgreSQL
            cursor.execute(
                """UPDATE public."Story" 
                SET image_data = %s 
                WHERE id = %s;""",
                (psycopg2.Binary(image_data), int(index))
            )
            conn.commit()
            print(f"✅ Đã lưu ảnh cho câu chuyện {index}.")
        else:
            print(f"❌ Ảnh không tải được (HTTP {response.status_code}) cho câu chuyện {index}.")

    except Exception as e:
        print(f"❌ Không thể tải ảnh cho câu chuyện {index}: {e}")

driver.quit()
conn.close()
