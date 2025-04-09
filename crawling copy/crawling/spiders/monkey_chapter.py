import json
import scrapy
import os

class MonkeyStoryCrawler(scrapy.Spider):
    name = "monkey_story_crawler"
    
    def __init__(self, *args, **kwargs):
        super(MonkeyStoryCrawler, self).__init__(*args, **kwargs)
        self.url = kwargs.get('url')
        self.story_id = kwargs.get('story_id')
        
        # Create directory structure
        self.stories_dir = "stories_info"
        self.story_dir = os.path.join(self.stories_dir, self.story_id)
        
        # Create directories if they don't exist
        os.makedirs(self.story_dir, exist_ok=True)
        
        # Output file path
        self.output_file = os.path.join(self.story_dir, "info.json")
    
    def start_requests(self):
        if self.url:
            yield scrapy.Request(self.url, self.parse)
    
    def parse(self, response):
        chapter_urls = response.css(".list-chapters .episode-title a::attr(href)").getall()
        # genre = response.css(".cate-item::text").getall()
        # author = response.css(".col-sm-9::text").getall()[3].strip()
        # groups = response.css(".col-sm-9 .btn.btn-sm.btn-info::text").getall()
        # groups = [group.strip() for group in groups]
        # state = response.css(".col-sm-9::text").getall()[9].strip()
        description = response.css(".story-description p::text").getall()
        description = "\n".join(description).strip()
        
        author = response.xpath('//dt[contains(text(), "Tác giả")]/following-sibling::dd[1]/text()').get(default='').strip()

        genre = response.xpath('//dt[contains(text(), "Loại")]/following-sibling::dd[1]//span/text()').get(default='').strip()

        groups = response.xpath('//dt[contains(text(), "Team")]/following-sibling::dd[1]//a/@href').getall()
        groups = [g.strip() for g in groups]

        state = response.xpath('//dt[contains(text(), "Trạng thái")]/following-sibling::dd[1]/text()').get(default='').strip()


        # Create story data
        story_data = {
            "id": self.story_id,
            "url": response.url,
            "chapter_urls": chapter_urls,
            "genre": genre,
            "author": author,
            "groups": groups,
            "state": state,
            "description": description
        }
        
        # Save the data to the story-specific directory
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(story_data, f, indent=4, ensure_ascii=False)
        
        self.logger.info(f"Saved story information to {self.output_file}")
        
        # Also yield the data for Scrapy's normal output
        yield story_data