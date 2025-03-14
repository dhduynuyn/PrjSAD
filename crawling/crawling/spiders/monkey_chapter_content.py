from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import scrapy
import json

class MonkeyStoryCrawler(scrapy.Spider):
    name = "monkey_content_crawler"
    chapter_title = ""
    chapter_content = ""
    
    def start_requests(self):
        url = getattr(self, 'url', None)  # Get URL from command line argument
        if url:
            yield scrapy.Request(url, self.parse)

    def parse(self, response):
        self.chapter_title = response.css(".card-title::text").get() 
        self.chapter_content = response.css(".content-container p:not(.signature)::text").getall()
        self.chapter_content = "\n".join(self.chapter_content)#.replace("[Truyện được đăng tải duy nhất tại monkeydtruyen.com - ", "").replace(".]", "")#.replace("\xa0", "\n\n")

        print("title: ", self.chapter_title)
        print("content: \n", self.chapter_content)
        
