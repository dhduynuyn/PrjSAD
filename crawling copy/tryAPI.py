import requests
import json
from dotenv import load_dotenv
import os
load_dotenv()

# API Key của bạn
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY

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

        # ✅ Truy xuất phần tóm tắt từ cấu trúc đúng của Gemini API
        summary = response_data.get("candidates", [])[0]["content"]["parts"][0]["text"]
        return summary.strip()

    except (KeyError, IndexError):
        print(f"❌ Không thể trích xuất nội dung từ phản hồi Gemini cho truyện: {title}")
        print("📥 Phản hồi API:", json.dumps(response_data, indent=2, ensure_ascii=False))
        return ""
    except requests.exceptions.Timeout:
        print(f"❌ Quá thời gian chờ phản hồi từ Gemini API cho truyện: {title}")
        return ""
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi gọi Gemini API cho truyện: {title} - {e}")
        return ""

# Ví dụ gọi hàm
title = "Ta Phẫn Nam Trang Giả Làm Thái Tử"
genres = "Fantasy, Action"
description = "Một câu chuyện xoay quanh một nhân vật chính trong một thế giới giả tưởng, nơi anh ta phải đối mặt với những thử thách khắc nghiệt."

summary = generate_summary_with_gemini(title, genres, description)
print("Tóm tắt:", summary)
