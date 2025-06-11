import os
import psycopg2
import requests
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Load biến môi trường từ .env
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

# BASE_URL user page
BASE_URL = "https://monkeyd.net.vn/nhom-dich"

try:
    # Lấy toàn bộ user_id từ DB
    cursor.execute('SELECT user_id FROM public."Users"')
    user_ids = [row[0] for row in cursor.fetchall()]
    print(f"🔍 Có {len(user_ids)} user sẽ được xử lý")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }

    for user_id in user_ids:
        try:
            user_url = f"{BASE_URL}/{user_id}"
            print(f"🌐 Đang truy cập {user_url}...")

            driver.get(user_url)
            driver.implicitly_wait(5)

            # Lấy ảnh avatar trong div hoặc img class img-fluid
            image_element = driver.find_element(By.CSS_SELECTOR, "img.img-fluid")
            profile_image_url = image_element.get_attribute("src")

            if not profile_image_url or "no-image.png" in profile_image_url:
                print(f"⚠️ Không có ảnh thật cho user {user_id}")
                continue

            # Tải ảnh, thêm header giả lập trình duyệt thật, thêm Referer là user_url
            headers["Referer"] = user_url
            image_response = requests.get(profile_image_url, headers=headers, timeout=10)

            if image_response.status_code != 200:
                print(f"❌ Không tải được ảnh cho user {user_id} (HTTP {image_response.status_code})")
                continue

            profile_image_binary = psycopg2.Binary(image_response.content)

            # Cập nhật ảnh vào DB
            cursor.execute("""
                UPDATE public."Users"
                SET profile_image = %s
                WHERE user_id = %s
            """, (profile_image_binary, user_id))
            conn.commit()
            print(f"✅ Đã cập nhật ảnh cho user {user_id}")

        except Exception as e:
            conn.rollback()
            print(f"❌ Lỗi khi xử lý user {user_id}: {e}")

finally:
    driver.quit()
    cursor.close()
    conn.close()
    print("🔚 Hoàn tất cập nhật ảnh đại diện.")
