from together import Together

from dotenv import load_dotenv
import re
import psycopg2
import os
load_dotenv()
api = os.getenv(os.getenv('TOGETHER_API_KEY'))

client = Together(api_key=api)

def gen_response(input_prompt):
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": input_prompt}],
        model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
    )
    result = response.choices[0].message.content
    result = re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL)
    return result

