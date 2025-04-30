import psycopg2
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import os
from dotenv import load_dotenv
from sklearn.preprocessing import normalize

load_dotenv()

# Load mô hình embedding
model = SentenceTransformer("keepitreal/vietnamese-sbert")

# Tập các từ khóa liên quan
KEYWORDS = [
    "Bách Hợp", "BE", "Chữa Lành", "Cổ Đại", "Cung Đấu", "Cưới Trước Yêu Sau",
    "Cường Thủ Hào Đoạt", "Dị Năng", "Dưỡng Thê", "Đam Mỹ", "Điền Văn", "Đô Thị",
    "Đoản Văn", "Đọc Tâm", "Gả Thay", "Gia Đấu", "Gia Đình", "Gương Vỡ Không Lành",
    "Gương Vỡ Lại Lành", "Hài Hước", "Hành Động", "Hào Môn Thế Gia", "HE", "Hệ Thống",
    "Hiện Đại", "Hoán Đổi Thân Xác", "Học Bá", "Học Đường", "Hư Cấu Kỳ Ảo", "Huyền Huyễn",
    "Không CP", "Kinh Dị", "Linh Dị", "Mạt Thế", "Ngôn Tình", "Ngọt",
    "Ngược", "Ngược Luyến Tàn Tâm", "Ngược Nam", "Ngược Nữ", "Nhân Thú", "Niên Đại",
    "Nữ Cường", "OE", "Phép Thuật", "Phiêu Lưu", "Phương Đông", "Phương Tây",
    "Quy tắc", "Sảng Văn", "SE", "Showbiz", "Sủng", "Thanh Xuân Vườn Trường",
    "Tiên Hiệp", "Tiểu Thuyết", "Tổng Tài", "Trà Thù", "Trinh thám", "Trọng Sinh",
    "Truy Thê", "Và Mặt", "Vô Tri", "Xuyên Không", "Xuyên Sách"
]


# Kết nối database
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    connect_timeout=int(os.getenv("DB_CONNECT_TIMEOUT", 10))
)
cursor = conn.cursor()

# Lọc truyện có genre phù hợp
def fetch_filtered_stories():
    query = f"""
        SELECT id, title, description, genres
        FROM public."Story"
    """
    cursor.execute(query)
    return cursor.fetchall()

def build_or_load_index():
    try:
        with open("filtered_story_vectors.pkl", "rb") as f:
            data = pickle.load(f)
            print("✅ Đã load FAISS index và metadata.")
            return data["index"], data["story_info"]
    except FileNotFoundError:
        print("🔄 Đang xây dựng FAISS index...")
        stories = fetch_filtered_stories()
        story_info = []
        embeddings = []

        for sid, title, desc, genre in stories:
            title = title.strip()
            desc = desc.strip()
            genre = genre.strip()

            # Encode từng phần riêng lẻ
            title_emb = normalize([model.encode(title)])[0]
            desc_emb = normalize([model.encode(desc)])[0]
            genre_emb = normalize([model.encode(genre)])[0]

            # Kết hợp với trọng số: ưu tiên genre
            combined_emb = 2 * genre_emb + 1 * title_emb + 1 * desc_emb
            embeddings.append(combined_emb)

            story_info.append({
                "id": sid,
                "title": title,
                "description": desc,
                "genre": genre
            })

        vectors = np.array(embeddings).astype("float32")
        index = faiss.IndexFlatL2(vectors.shape[1])
        index.add(vectors)

        with open("filtered_story_vectors.pkl", "wb") as f:
            pickle.dump({"index": index, "story_info": story_info}, f)

        print("✅ FAISS index đã được xây dựng và lưu.")
        return index, story_info

# Tìm kiếm truyện gần nhất
def search(query, index, story_info, k=5):
    q_vec = model.encode([query])
    D, I = index.search(np.array(q_vec).astype("float32"), k)

    results = []
    for idx in I[0]:
        s = story_info[idx]
        results.append(s)
    return results

# Giao diện CLI đơn giản
def chatbot():
    index, story_info = build_or_load_index()

    print("Bạn muốn tìm truyện như thế nào? (nhập 'exit' để thoát)")
    while True:
        query = input("> ").strip()
        if query.lower() == "exit":
            break

        results = search(query, index, story_info)
        print("\n📚 Gợi ý truyện phù hợp:")
        for res in results:
            print(f" - {res['title']}. {res['description'][:400]}... {res['genre']}\n")

chatbot()
