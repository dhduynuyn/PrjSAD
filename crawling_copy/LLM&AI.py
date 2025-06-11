import os
import json
import pickle
import faiss
import numpy as np
import time
import psycopg2
import requests
import logging
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# === Load config từ file .env ===
load_dotenv()

# === SBERT model for embedding ===
embedding_model = SentenceTransformer("keepitreal/vietnamese-sbert")

# === API Gemini Config ===
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# === PostgreSQL config ===
PG_HOST = os.getenv("DB_HOST")
PG_PORT = os.getenv("DB_PORT", "5432")
PG_NAME = os.getenv("DB_NAME")
PG_USER = os.getenv("DB_USER")
PG_PASSWORD = os.getenv("DB_PASSWORD")

# === Cấu hình logging để ghi lại lỗi ===
logging.basicConfig(level=logging.DEBUG, filename="errors.log", filemode="w")

# === Hàm gọi API Gemini để sinh tóm tắt ===
def generate_summary_with_gemini(title, genres, description):
    prompt = f"""
    Bạn là một AI chuyên đánh giá và tóm tắt truyện chữ. Với đầu vào là:
    - Tiêu đề: {title}
    - Thể loại: {genres}
    - Nội dung: {description}

    Hãy viết một đoạn từ 100-150 từ:
    1. Tóm tắt nội dung
    2. Đưa ra cảm nhận hoặc nhận xét tổng quan
    3. Viết mạch lạc, trôi chảy bằng tiếng Việt
    """

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(gemini_api_url, headers=headers, data=json.dumps(payload), timeout=30)
        response.raise_for_status()
        response_data = response.json()

        # ✅ Lấy đúng tóm tắt từ phản hồi
        summary = response_data.get("candidates", [])[0]["content"]["parts"][0]["text"]
        return summary.strip()

    except (KeyError, IndexError):
        print(f"❌ API Gemini không trả về trường 'content' cho truyện: {title}")
        logging.error(f"Không có content trong phản hồi Gemini cho truyện: {title}\nPhản hồi: {json.dumps(response_data, ensure_ascii=False)}")
        return ""
    except requests.exceptions.Timeout:
        print(f"❌ Quá thời gian chờ phản hồi từ Gemini API cho truyện: {title}")
        logging.error(f"Timeout khi gọi Gemini API cho truyện: {title}")
        return ""
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi gọi Gemini API cho truyện: {title} - {e}")
        logging.error(f"Lỗi khi gọi Gemini API cho truyện {title}: {str(e)}")
        return ""

# === Kết nối đến cơ sở dữ liệu PostgreSQL ===
conn = psycopg2.connect(
    host=PG_HOST,
    port=PG_PORT,
    dbname=PG_NAME,
    user=PG_USER,
    password=PG_PASSWORD
)
cursor = conn.cursor()

# === Lấy dữ liệu từ bảng stories ===
cursor.execute("""SELECT id, title, description, genres FROM public."Story" WHERE summary IS NULL OR summary = '';""")
rows = cursor.fetchall()

metadata_list = []
embedding_texts = []

# === Xử lý từng truyện ===
for row in rows:
    id, title, description, genres_raw = row
    genres = ", ".join(genres_raw) if isinstance(genres_raw, list) else genres_raw or ""

    try:
        summary = generate_summary_with_gemini(title, genres, description)
    except Exception as e:
        print(f"❌ Lỗi khi sinh tóm tắt cho truyện: {title} _ {e}")
        summary = ""

    if summary:
        print(f"✅ Tóm tắt cho truyện {title}: {summary}")
    else:
        print(f"❌ Không có tóm tắt cho truyện {title}")

    # metadata_list.append({
    #     "id": id,
    #     "title": title,
    #     "genres": genres,
    #     "description": description,
    #     "summary": summary
    # })

    # Cập nhật tóm tắt vào cơ sở dữ liệu
    try:
        cursor.execute("""
            UPDATE public."Story"
            SET summary = %s
            WHERE id = %s;
        """, (summary, id))
        conn.commit()
        print(f"✅ Đã cập nhật tóm tắt cho truyện ID: {id}")
    except Exception as e:
        print(f"❌ Lỗi khi cập nhật tóm tắt vào DB cho truyện ID: {id} - {e}")
        logging.error(f"Lỗi khi cập nhật tóm tắt vào DB cho truyện ID: {id} - {e}")

    #embedding_text = f"{id}. {title}. {genres}. {description}. {summary}"
    #embedding_texts.append(embedding_text)

# === Tạo embedding ===
print("🔄 Đang tạo embeddings...")
#embeddings = embedding_model.encode(embedding_texts, convert_to_numpy=True, show_progress_bar=True)

# === Build FAISS index ===
# dim = embeddings.shape[1]
# index = faiss.IndexFlatL2(dim)
# index.add(np.array(embeddings).astype("float32"))

# === Lưu index & metadata ===
# faiss.write_index(index, "story_faiss.index")

# with open("stories_embeddings.pkl", "wb") as f:
#     pickle.dump(metadata_list, f)

print("✅ Đã lưu story_faiss.index và stories_embeddings.pkl chứa AI reply + metadata.")

# === Đóng kết nối DB ===
cursor.close()
conn.close()
