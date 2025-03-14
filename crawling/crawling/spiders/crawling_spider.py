from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import scrapy
import json

class CrawlingSpider(scrapy.Spider):
    name = "crawlerspider#0"
    allowed_domains = ["monkeyd.com.vn"]
    start_urls = ["https://monkeyd.com.vn/truyen-hoan-thanh.html"]
    story_dict = {}  # Dictionary lưu danh sách truyện
    counter:int = 1  # Biến đếm tự động tăng

    def start_requests(self):
        """Duyệt qua nhiều trang danh sách truyện"""
        for page in range(1, 11):  # Crawl nhiều trang nếu cần
            url = f"{self.start_urls[0]}?page={page}"
            yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        """Lấy danh sách truyện từ trang danh sách"""
        stories = response.xpath('//div[contains(@class, "col-md-3") and contains(@class, "col-6")]')

        for story in stories:
            title = story.css('.card-title::text').get()
            url = story.xpath('.//div[contains(@class, "card-body")]/a[1]/@href').get()

            if title and url:
                full_url = response.urljoin(url)
                self.story_dict[self.counter] = {"title": title.strip(), "url": full_url}
                self.counter += 1  # Tăng biến đếm

    def closed(self, reason):
        """Chạy khi Spider đóng -> Lưu dữ liệu vào JSON"""
        with open("stories.json", "w", encoding="utf-8") as f:
            json.dump(self.story_dict, f, ensure_ascii=False, indent=4)
        self.log(f"Dữ liệu đã được lưu vào stories.json")
        
    # rules = (
    #     # link have pattern for the-loai
    #     # Rule(LinkExtractor(allow="monkeyd", deny="chuong-")),
    #     # Rule(LinkExtractor(tags="card-title cursor-pointer story-item-title"))
    #     Rule(
    #         LinkExtractor(restrict_css=".card-title.cursor-pointer.story-item-title"),
    #         callback="parse_item",
    #         follow=False
    #     ),
    # )

    # def parse_item(self, response):
    #     titles = response.css(".card-title.cursor-pointer.story-item-title::text").getall()
        
    #     for title in titles:
    #         yield {
    #             "title": title.strip()  # Xóa khoảng trắng thừa nếu có
    #         }
    
    # def start_requests(self):
    #     """Hàm này gọi `parse()` thủ công thay vì Scrapy tự động xử lý `start_urls`"""
    #     for url in self.start_urls:
    #         yield scrapy.Request(url=url, callback=self.parse)

    # def parse(self, response):
    #     print("-" * 20)  # Debug để kiểm tra xem Scrapy có vào đây không
    #     # Lấy danh sách tiêu đề truyện
    #     titles = response.css(".card-title.cursor-pointer.story-item-title::text").getall()

    #     for title in titles:
    #         yield {
    #             "title": title.strip()  # Xóa khoảng trắng thừa nếu có
    #         }
            

