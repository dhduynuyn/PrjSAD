from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import scrapy
import os
import json

class MonkeyStoryCrawler(scrapy.Spider):
    name = "monkey_content_crawler"
    chapter_title = ""
    chapter_content = ""
    
    def __init__(self, *args, **kwargs):
        super(MonkeyStoryCrawler, self).__init__(*args, **kwargs)
        self.url = kwargs.get('url')
        self.story_id = kwargs.get('story_id')
        self.chapter_index = kwargs.get('chapter_index', '0')
        
        # Create directory structure
        self.stories_dir = "stories_info"
        self.story_dir = os.path.join(self.stories_dir, self.story_id)
        self.chapters_dir = os.path.join(self.story_dir, "chapters")
        
        # Create directories if they don't exist
        os.makedirs(self.story_dir, exist_ok=True)
        os.makedirs(self.chapters_dir, exist_ok=True)
        
        # Output file path for this chapter
        self.output_file = os.path.join(self.chapters_dir, f"chapter_{self.chapter_index}.json")
    
    def start_requests(self):
        url = getattr(self, 'url', None)  # Get URL from command line argument
        if url:
            yield scrapy.Request(url, self.parse)
    
    def parse(self, response):
        print("CHECK~")
        print(response)
        self.chapter_title = response.css(".card-title::text").get()
        
        self.chapter_content = response.css(".content-container p:not(.signature)::text").getall()
        self.chapter_content = "\n".join(self.chapter_content)

        # Xoá đoạn văn bản không mong muốn (dù có xuống dòng, khoảng trắng)
        unwanted = "Mời Quý độc giả \n vào \n bên dưới\n để tiếp tục đọc toàn bộ chương truyện!\n\n                        \n\n                    \n"
        self.chapter_content = self.chapter_content.replace(unwanted, "").strip()
        
        # Create data structure for this chapter
        chapter_data = {
            "title": self.chapter_title,
            "content": self.chapter_content,
            "url": response.url
        }
        
        # Save the chapter data to a file
        self.save_chapter_data(chapter_data)
        
        # Return the data for pipeline processing if needed
        return chapter_data
    
    def save_chapter_data(self, chapter_data):
        print("SAVE")
        # Save chapter data to JSON file
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(chapter_data, f, ensure_ascii=False, indent=4)
        
        self.log(f"Saved chapter data to {self.output_file}")
        
        # Also update the chapters list in the main story info.json file
        self.update_story_info(chapter_data)
    
    def update_story_info(self, chapter_data):
        # Path to the story's info.json file
        info_file = os.path.join(self.story_dir, "info.json")
        
        # Load existing info if available
        story_info = {}
        if os.path.exists(info_file):
            try:
                with open(info_file, 'r', encoding='utf-8') as f:
                    story_info = json.load(f)
            except json.JSONDecodeError:
                self.log(f"Error reading {info_file}, creating new file")
        
        # Initialize chapters list if not present
        if "chapters" not in story_info:
            story_info["chapters"] = []
        
        # Check if this chapter already exists by URL
        chapter_exists = False
        for i, chapter in enumerate(story_info["chapters"]):
            if chapter.get("url") == chapter_data["url"]:
                # Update existing chapter
                story_info["chapters"][i] = chapter_data
                chapter_exists = True
                break
        
        # Add new chapter if it doesn't exist
        if not chapter_exists:
            story_info["chapters"].append(chapter_data)
        
        # Save updated info back to file
        with open(info_file, 'w', encoding='utf-8') as f:
            json.dump(story_info, f, ensure_ascii=False, indent=4)