import json
import os
import subprocess

def load_stories(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def save_stories(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def run_scrapy(stories):
    # Create the main stories_info directory if it doesn't exist
    os.makedirs("stories_info", exist_ok=True)
    
    for story_id, story in stories.items():
        url = story["url"]
        print(f"Đang chạy Scrapy cho: {url}")
        
        # Run Scrapy with story_id parameter
        subprocess.run([
            "scrapy", "crawl", "monkey_story_crawler", 
            "-a", f"url={url}", 
            "-a", f"story_id={story_id}"
        ])

def update_stories_from_directories(stories):
    stories_dir = "stories_info"
    
    if not os.path.exists(stories_dir):
        print(f"{stories_dir} không tồn tại. Hãy chạy Scrapy trước.")
        return stories
    
    updated_stories = stories.copy()
    
    # Loop through all story directories
    for story_id in os.listdir(stories_dir):
        story_info_path = os.path.join(stories_dir, story_id, "info.json")
        
        if os.path.exists(story_info_path):
            try:
                with open(story_info_path, "r", encoding="utf-8") as f:
                    story_data = json.load(f)
                
                if story_id in updated_stories:
                    updated_stories[story_id].update({
                        "chapter_urls": story_data.get("chapter_urls", []),
                        "genre": story_data.get("genre", ""),
                        "author": story_data.get("author", ""),
                        "groups": story_data.get("groups", ""),
                        "state": story_data.get("state", ""),
                        "description": story_data.get("description", "")
                    })
                    print(f"Đã cập nhật: {story_id}")
                    print("-" * 20)
            except json.JSONDecodeError:
                print(f"Lỗi đọc file {story_info_path}")
    
    return updated_stories

def main():
    stories_file = "stories.json"
    
    stories = load_stories(stories_file)
    run_scrapy(stories)
    updated_stories = update_stories_from_directories(stories)
    save_stories(stories_file, updated_stories)
    print("Cập nhật stories.json thành công!")

if __name__ == "__main__":
    main()