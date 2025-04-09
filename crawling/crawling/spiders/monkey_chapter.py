from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import scrapy
import json
import re

class MonkeyStoryCrawler(scrapy.Spider):
    name = "monkey_story_crawler"
    chapter_urls = [] # List lưu danh sách URL chương truyện
    
    
    def start_requests(self):
        url = getattr(self, 'url', None)  # Get URL from command line argument
        if url:
            yield scrapy.Request(url, self.parse)

    def parse(self, response):
        self.chapter_urls = response.css(".list-chapters .episode-title a::attr(href)").getall() 
        self.genre = response.css(".cate-item::text").getall()
        self.author = response.css(".col-sm-9::text").getall()[3]
        self.groups = response.css(".col-sm-9 .btn.btn-sm.btn-info::text").getall()
        self.groups = [group.strip() for group in self.groups]
        self.groups = [re.search(r'/(\d+)$', link).group(1) for link in self.groups if re.search(r'/(\d+)$', link)]
        self.state = response.css(".col-sm-9::text").getall()[9]
        self.description = response.css(".story-description p::text").getall()
        self.description = "\n".join(self.description).strip()
        
        # print(self.description)
        # print("genre: ", self.genre)
        # print("author: ", self.author)
        # print("groups: ", self.groups)
        # print("state: ", self.state)
