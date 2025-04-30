import psycopg2
import os
import base64
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

# Kết nối đến PostgreSQL
connection = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    connect_timeout=int(os.getenv('DB_CONNECT_TIMEOUT'))
)

cursor = connection.cursor()

# ID bạn muốn kiểm tra
story_id = 50

# Lấy image_data từ database
cursor.execute("""SELECT image_data 
               FROM public."Story" 
               WHERE id = %s""", (story_id,))
result = cursor.fetchone()

if result and result[0]:
    image_bytes = result[0]
    image = Image.open(BytesIO(image_bytes))
    image.show()
else:
    print(f"Không tìm thấy ảnh cho story id = {story_id}")

# Đóng kết nối
cursor.close()
connection.close()
