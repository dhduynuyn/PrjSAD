from together import Together

client = Together(api_key="hf_xxxxxxxxxxxxxx")

response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
    messages=[
      {
        "role": "user",
        "content": "traslate this to English: 'Dưới ánh hoàng hôn rực rỡ, một cô gái mặc áo dài trắng đứng lặng bên bờ sông, gió nhẹ làm tà áo khẽ bay, phía sau là hàng dừa nghiêng bóng in xuống mặt nước lấp lánh'"
      }
    ],
    stream=True
)

output = ""
for token in response:
    if hasattr(token, 'choices'):
        output += token.choices[0].delta.content

# Remove <think> ... </think> if it exists
import re
cleaned_output = re.sub(r"<think>.*?</think>", "", output, flags=re.DOTALL)

print(cleaned_output.strip())