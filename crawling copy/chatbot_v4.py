import os
import time
import pickle
import faiss
import numpy as np
from dotenv import load_dotenv
from typing import Any, Dict, List, Optional, Mapping

from sentence_transformers import SentenceTransformer
from gpt4all import GPT4All
from langchain_core.language_models.llms import LLM
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain.schema import Document

# --- Cấu hình ---
load_dotenv()
EMBED_MODEL_NAME = "keepitreal/vietnamese-sbert"
FAISS_INDEX_PATH = "story_faiss.index"
METADATA_PATH = "stories_embeddings.pkl"
LOCAL_MODEL_NAME = "Mistral-7B-Instruct-v0.1.Q4_0.gguf"
MODEL_DOWNLOAD = "Llama-3.2-1B-Instruct-Q4_0.gguf"
BASE_DIR = os.getcwd()
LOCAL_MODEL_DIR = os.path.join(BASE_DIR, "local_model")  # Trỏ vào thư mục local_model

# --- Tải embedding model ---
embedding_model = SentenceTransformer(EMBED_MODEL_NAME)

# --- Tải FAISS và metadata ---
faiss_index = faiss.read_index(FAISS_INDEX_PATH)
with open(METADATA_PATH, "rb") as f:
    story_metadata = pickle.load(f)

# --- Hàm tìm kiếm ---
def find_similar_stories(user_query, top_k=3):
    query_embedding = embedding_model.encode([user_query], convert_to_numpy=True)
    distances, indices = faiss_index.search(query_embedding, top_k)
    results = []

    for i in indices[0]:
        if i < len(story_metadata):
            story = story_metadata[i]
            results.append(Document(page_content=f"📘 {story['title']}:\n{story['summary']}", metadata=story))
    return results

# --- Prompt mẫu (giống Llama/Mistral style) ---
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "<|system|>Bạn là một trợ lý AI chuyên về truyện Việt Nam, giúp trả lời câu hỏi hoặc gợi ý truyện.\n"
        "<|user|>\n"
        "Dựa vào truyện sau:\n{context}\n\nCâu hỏi: {question}\n"
        "<|assistant|>"
    )
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# --- Khởi tạo LLM local ---
class CustomGPT4All(LLM):
    model: Any
    model_path: str

    @property
    def _llm_type(self) -> str:
        return "custom_gpt4all"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        response = self.model.generate(
            prompt,
            max_tokens=512,
            temp=0.7,
            top_k=40,
            top_p=0.9,
            repeat_penalty=1.2,
        )
        return response

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        return {"model_path": self.model_path}

print("🚀 Đang khởi tạo mô hình local...")
gpt4all_model = GPT4All(model_name=LOCAL_MODEL_NAME, model_path=LOCAL_MODEL_DIR, allow_download=False)
llm = CustomGPT4All(model=gpt4all_model, model_path=LOCAL_MODEL_DIR)
print("✅ Mô hình đã sẵn sàng.")

# --- Chain hội thoại ---
from langchain_core.runnables import RunnableLambda

rag_chain = (
    {"context": find_similar_stories, "question": RunnablePassthrough()}
    | RunnableLambda(lambda x: {"context": format_docs(x["context"]), "question": x["question"]})
    | prompt_template
    | llm
)

# --- Hàm hội thoại chính ---
def get_story_response(query, chat_history):
    start = time.time()
    result = rag_chain.invoke(query)
    elapsed = time.time() - start

    chat_history.append((query, result))
    return result, elapsed

# --- Giao diện dòng lệnh đơn giản (tùy chọn) ---
if __name__ == "__main__":
    chat_history = []
    print("🧠 Chatbot truyện Việt Nam - Dùng LLM nội bộ\n---")
    while True:
        query = input("👤 Bạn: ")
        if query.lower() in ["exit", "quit", "thoát"]:
            break
        response, _ = get_story_response(query, chat_history)
        print("🤖:", response)
