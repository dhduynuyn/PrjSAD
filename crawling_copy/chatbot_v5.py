import os
import pickle
import faiss
import numpy as np
import psycopg2
from dotenv import load_dotenv
from sklearn.preprocessing import normalize
from sentence_transformers import SentenceTransformer
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from gen_reanswer_from_AI import gen_response
load_dotenv()

# ========== CONFIG ========== 
DB_CONFIG = {
    "dbname": os.getenv('DB_NAME'),
    "user": os.getenv('DB_USER'),
    "password": os.getenv('DB_PASSWORD'),
    "host": os.getenv('DB_HOST'),
    "port": os.getenv('DB_PORT')
}

EMBEDDING_FILE = "story_embeddings.pkl"
INDEX_FILE = "story_faiss.index"
MODEL_NAME = "keepitreal/vietnamese-sbert"

# ========== LOAD MODEL ========== 
model = SentenceTransformer(MODEL_NAME)

# ========== LOAD DATA FROM DATABASE ========== 
def fetch_story_data():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("""SELECT id, title, description, summary, genres
                FROM public."Story"; """)  # Cập nhật query để lấy thêm cột 'genres'
    rows = cur.fetchall()
    conn.close()
    return rows

# ========== EMBEDDING ========== 
def create_texts_and_embeddings(data):
    texts = []
    embeddings = []

    for row in data:
        _, title, description, summary, genre = row
        title = title or ""
        description = description or ""
        summary = summary or ""  # Đảm bảo summary được sử dụng
        genre = genre or ""

        # Kết hợp genre, title, description, summary vào full_text
        full_text = f"{genre}. {title}. {description}. {summary}"
        try:
            emb = model.encode([full_text])[0]  # Trả về vector 1D
            texts.append((full_text, summary, genre))  # Lưu cả full_text, summary và genre
            embeddings.append(emb)
        except Exception as e:
            print(f"⚠️ Bỏ qua vì lỗi encode: {title}\n{e}")

    return texts, np.array(embeddings, dtype=np.float32)

# ========== SAVE ========== 
def save_index_and_data(index, texts):
    faiss.write_index(index, INDEX_FILE)
    with open(EMBEDDING_FILE, "wb") as f:
        pickle.dump(texts, f)

# ========== LOAD ========== 
def load_index_and_data():
    if not os.path.exists(INDEX_FILE) or not os.path.exists(EMBEDDING_FILE):
        return None, None
    index = faiss.read_index(INDEX_FILE)
    with open(EMBEDDING_FILE, "rb") as f:
        texts = pickle.load(f)
    return index, texts

# ========== BUILD VECTOR DB ========== 
def build_index(embeddings):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index
    

# ========== MAIN ========== 
def setup():
    index, texts = load_index_and_data()
    if index is not None and texts is not None:
        print("✅ Đã load index và embedding từ file.")
        return index, texts

    print("📥 Đang lấy dữ liệu từ PostgreSQL...")
    data = fetch_story_data()
    texts, embeddings = create_texts_and_embeddings(data)
    index = build_index(embeddings)
    save_index_and_data(index, texts)
    print("✅ Đã tạo và lưu index mới.")
    return index, texts

def gen_query(user_want, answer):
    prompt = (
        "Đây là một cuộc trò chuyện, trong đó người dùng đang tìm truyện để đọc.\n"
        "Đây là câu hỏi của người dùng: " f"{user_want}\n\n"
        "Hệ thống đã tìm được một số truyện phù hợp thông qua truy vấn embedding.\n\n"
        "Nhiệm vụ của bạn là: Viết lại một câu trả lời phù hợp với người dùng, giới thiệu truyện một cách tự nhiên, "
        "không quá dài dòng, và chỉ giới thiệu những truyện bạn nghĩ phù hợp nhất do model emdedding còn khá nhiều lỗi.\n"
        "\n\n"
        f"Dưới đây là kết quả truy vấn:\n{answer}\n\n"
        "Hãy tạo ra một đoạn phản hồi mạch lạc, thân thiện và phù hợp ngữ cảnh hội thoại."
    )
    return prompt

# ========== CHAT ========== 
index, texts = setup()

def chat(query):
    # Tính toán embedding cho title, description, summary và genre của truy vấn
    emb_title = model.encode(query)
    emb_desc = model.encode(query)
    emb_summary = model.encode(query)
    emb_genre = model.encode(query)

    # Tổng hợp các vector với trọng số cho genre, summary, description và title
    query_vector = emb_title + emb_desc + 3 * emb_summary + 2 * emb_genre
    query_vector = np.array([query_vector]).astype("float32")

    # Tìm kiếm trong index
    D, I = index.search(query_vector, k=15)
    user_want = query.strip().lower()
    answer = "📚 Gợi ý truyện phù hợp:"
    for i in I[0]:
        full_text, summary, genre = texts[i]
        answer += f"👉 Tóm tắt: {summary}\n 🔖 Thể loại: {genre}\n"

        
    print(answer)
    query = gen_query(user_want, answer)
    AI_answer = gen_response(query)
    print(f"🤖 AI trả lời: {AI_answer}")
    return AI_answer

# ========== RUN ========== 
# if __name__ == "__main__":
    
#     chat(index, texts)
