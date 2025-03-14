from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import scrapy
import json

class MonkeyStoryCrawler(scrapy.Spider):
    name = "monkey_story_crawler"
    chapter_urls = [] # List lưu danh sách URL chương truyện
    
    def start_requests(self):
        url = getattr(self, 'url', None)  # Get URL from command line argument
        if url:
            yield scrapy.Request(url, self.parse)

    def parse(self, response):
        self.chapter_urls = response.css(".list-chapters .episode-title a::attr(href)").getall() 
        self.log(f"Scraped URL: {response.url}")
        
        for chapter_url in self.chapter_urls:
            print(chapter_url)
