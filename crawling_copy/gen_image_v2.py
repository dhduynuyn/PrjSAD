from together import Together
import psycopg2
from dotenv import load_dotenv
import os
import base64
from gen_reanswer_from_AI import gen_response
load_dotenv()
api = os.getenv(os.getenv('TOGETHER_API_KEY'))

client = Together(api_key=api)

def gen_response_image(input_prompt):
    response = client.images.generate(
        prompt=input_prompt,
        model="black-forest-labs/FLUX.1-schnell-Free",
        width=1024,
        height=768,
        steps=4,
        n=1,
        response_format="b64_json",
        stop=[],
        _gl="1*1keu036*_gcl_au*MTQ1MDI3ODU1OS4xNzQ2MTE4ODI0*_ga*MTMwODMxMjk3MS4xNzQ2MTE4ODI0*_ga_BS43X21GZ2*MTc0NjExODgyNC4xLjEuMTc0NjExOTE1MS4wLjAuMA..*_ga_BBHKJ5V8S0*MTc0NjExODgyNC4xLjEuMTc0NjExOTE1MS4wLjAuMA.."
    )
    return response.data[0].b64_json



# Assuming `response.data[0].b64_json` is your base64 string

def gen_image(input_prompt):
    input_prompt = """Describe the image of this text in English, know that this is in Asia: """ + input_prompt
    english_prompt = gen_response(input_prompt)
    print("Translated prompt:", english_prompt)
    image_data = gen_response_image(english_prompt)
    return image_data


# gen_image("""Dự báo cung hoàng đạo nói rằng, Bạch Dương tuần này sao Tử Vi động, tài vận thịnh vượng, và đào hoa đến.O mai Dao Muoi 
# Đây chính là thời điểm tôi quay lại công ty, đại chiến bốn phương.
# Hôm nay quả thật là một ngày tinh thần sảng khoái, trở lại công ty, không những Thẩm Trạch không gây sự nữa, mà còn cho tôi thời gian để chuẩn bị đầy đủ cho bộ sưu tập xuân """)