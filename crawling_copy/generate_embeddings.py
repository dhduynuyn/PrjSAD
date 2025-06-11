import os
import pickle
import faiss
import numpy as np
import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# === Load config từ file .env ===
load_dotenv()

# === SBERT model for embedding ===
embedding_model = SentenceTransformer("keepitreal/vietnamese-sbert")

# === PostgreSQL config ===
PG_HOST = os.getenv("DB_HOST")
PG_PORT = os.getenv("DB_PORT", "5432")
PG_NAME = os.getenv("DB_NAME")
PG_USER = os.getenv("DB_USER")
PG_PASSWORD = os.getenv("DB_PASSWORD")

# === Kết nối đến cơ sở dữ liệu PostgreSQL ===
conn = psycopg2.connect(
    host=PG_HOST,
    port=PG_PORT,
    dbname=PG_NAME,
    user=PG_USER,
    password=PG_PASSWORD
)
cursor = conn.cursor()

# === Lấy các truyện đã có summary để tạo embedding ===
cursor.execute("""SELECT id, title, genres, description, summary FROM public."Story";""")
rows = cursor.fetchall()

metadata_list = []
embedding_texts = []

for row in rows:
    id, title, genres_raw, description, summary = row
    genres = ", ".join(genres_raw) if isinstance(genres_raw, list) else genres_raw or ""

    embedding_text = f"{id}. {title}. {genres}. {description}. {summary}"
    embedding_texts.append(embedding_text)

    metadata_list.append({
        "id": id,
        "title": title,
        "genres": genres,
        "description": description,
        "summary": summary
    })

# === Tạo embeddings với SBERT ===
print("🔄 Đang tạo embeddings...")
embeddings = embedding_model.encode(embedding_texts, convert_to_numpy=True, show_progress_bar=True)

# === Tạo FAISS index ===
dim = embeddings.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(np.array(embeddings).astype("float32"))

# === Lưu index và metadata ===
faiss.write_index(index, "story_faiss.index")

with open("stories_embeddings.pkl", "wb") as f:
    pickle.dump(metadata_list, f)

print("✅ Đã lưu story_faiss.index và stories_embeddings.pkl chứa AI reply + metadata.")

# === Đóng kết nối DB ===
cursor.close()
conn.close()
