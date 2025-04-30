import requests
from parsel import Selector  # 👉 Cho phép dùng XPath như Scrapy

# URL cần kiểm tra
test_url = "https://monkeyd.net.vn/ly-dao-le.html"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(test_url, headers=headers, timeout=10)

# Dùng parsel.Selector để dùng XPath
selector = Selector(text=response.text)

# Image URL
image_url = selector.xpath('//div[contains(@class,"text-center")]//img/@src').get()

# Thể loại
genres = selector.xpath('//dt[contains(text(), "Thể loại")]/following-sibling::dd[1]//a/text()').getall()

# Team
groups = selector.xpath('//dt[contains(text(), "Team")]/following-sibling::dd[1]//a/@href').getall()

# Lượt xem
views = selector.xpath('//dt[contains(text(), "Lượt xem")]/following-sibling::dd[1]/text()').get(default='').strip()

# Yêu thích
favorites = selector.xpath('//dt[contains(text(), "Yêu thích")]/following-sibling::dd[1]/text()').get(default='').strip()

# Lượt theo dõi
follows = selector.xpath('//dt[contains(text(), "Lượt theo dõi")]/following-sibling::dd[1]/text()').get(default='').strip()

group_ids = [url.rstrip('/').split('/')[-1] for url in groups]

# In kết quả
print("🖼 Image URL:", image_url)
print("📚 Genre:", genres)
print("👁 Views:", views)
print("❤️ Favorites:", favorites)
print("👤 Follows:", follows)
print("👥 Team:", group_ids)
