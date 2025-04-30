import os
import pickle
import faiss
import numpy as np
import psycopg2
from dotenv import load_dotenv
from sklearn.preprocessing import normalize
from sentence_transformers import SentenceTransformer
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
    cur.execute("""SELECT id, title, description, genres
                FROM public."Story"; """)
    rows = cur.fetchall()
    conn.close()
    return rows

# ========== EMBEDDING ==========
def create_texts_and_embeddings(data):
    texts = []
    embeddings = []

    for row in data:
        _, title, description, genre = row
        title = title or ""
        description = description or ""
        genre = genre or ""

        # Ưu tiên genre (trọng số lớn), mô hình sẽ hiểu được trọng số qua nhân đôi nội dung
        full_text = f"{genre}.{genre}.{genre}.{genre}. {genre}. {title}. {description}"
        try:
            emb = model.encode([full_text])[0]  # Trả về vector 1D
            texts.append(full_text)
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

# ========== CHAT ==========
def chat(index, texts):
    while True:
        query = input("\n💬 Bạn muốn tìm truyện như thế nào? (nhập 'exit' để thoát)\n> ")
        if query.strip().lower() == "exit":
            break

        emb_title = model.encode(query)
        emb_desc = model.encode(query)
        emb_genre = model.encode(query)

        query_vector = emb_title + emb_desc + 5 * emb_genre
        query_vector = np.array([query_vector]).astype("float32")

        D, I = index.search(query_vector, k=5)
        print("\n📚 Gợi ý truyện phù hợp:")
        for i in I[0]:
            print(" -", texts[i])


# ========== RUN ==========
if __name__ == "__main__":
    index, texts = setup()
    chat(index, texts)
