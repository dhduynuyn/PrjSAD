import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import openai
import os

load_dotenv()

# === Load model embedding ===
embedding_model = SentenceTransformer("keepitreal/vietnamese-sbert")

# === Load FAISS index và metadata ===
faiss_index = faiss.read_index("story_faiss.index")
with open("stories_embeddings.pkl", "rb") as f:
    story_metadata = pickle.load(f)

# === Cấu hình OpenAI GPT để tạo hội thoại ===
openai.api_key = os.getenv("OPENAI_API_KEY")

def find_similar_stories(user_query, top_k=5):
    query_embedding = embedding_model.encode([user_query], convert_to_numpy=True)
    distances, indices = faiss_index.search(query_embedding, top_k)

    results = []
    for i in indices[0]:
        if i < len(story_metadata):
            story = story_metadata[i]
            results.append(story)
    return results

def chat_with_gpt(messages):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7
    )
    return response['choices'][0]['message']['content'].strip()

def chatbot_loop():
    print("🤖 Xin chào! Tôi có thể giúp bạn tìm truyện hoặc trả lời câu hỏi. Hãy nhập câu hỏi của bạn:")
    history = [{"role": "system", "content": "Bạn là một trợ lý AI chuyên về truyện Việt Nam, có khả năng trò chuyện và trả lời các câu hỏi."}]
    
    while True:
        user_input = input("👤 Bạn: ")
        if user_input.lower() in ["thoát", "exit", "quit"]:
            print("🤖 Tạm biệt! Hẹn gặp lại.")
            break

        # === Tìm truyện liên quan (cho context) ===
        similar_stories = find_similar_stories(user_input, top_k=3)
        stories_info = "\n".join([f"📘 {s['title']}: {s['summary']}" for s in similar_stories if s.get("summary")])

        context = f"Người dùng hỏi: {user_input}\nCác truyện liên quan:\n{stories_info}\n"

        # === Gửi vào GPT-4 với context ===
        history.append({"role": "user", "content": context})
        reply = chat_with_gpt(history)
        print(f"🤖 GPT: {reply}")
        history.append({"role": "assistant", "content": reply})

# === Bắt đầu chatbot ===
if __name__ == "__main__":
    chatbot_loop()
