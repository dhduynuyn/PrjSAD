import requests

url = "https://monkeydtruyen.com/nhan-sinh-nhu-beo-dat-tinh-yeu-tua-bao-to/chuong-19.html"
encoded_url = requests.utils.quote(url)  # Encode the URL
response = requests.get(f"http://127.0.0.1:5000/crawl/{encoded_url}")

print(response)  # Print the result