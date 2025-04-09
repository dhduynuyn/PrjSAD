import json
import os
import subprocess
from collections import defaultdict

def load_stories(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def save_stories(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def crawl_chapter_content(stories):
    # Create a chapters directory to store chapter content
    os.makedirs("chapters_content", exist_ok=True)
    
    # Track which chapters we've processed for each story
    for story_id, story in stories.items():
        chapter_urls = story.get("chapter_urls", [])
        if not chapter_urls:
            print(f"Không tìm thấy chapter URLs cho truyện: {story_id}")
            continue
        
        # Create a directory for each story's chapters
        story_chapters_dir = os.path.join("chapters_content", story_id)
        os.makedirs(story_chapters_dir, exist_ok=True)
        
        print(f"Đang chạy crawl nội dung cho truyện: {story_id}")
        print(f"Số lượng chapter: {len(chapter_urls)}")
        
        # Crawl each chapter
        for i, chapter_url in enumerate(chapter_urls):
            print(f"Đang chạy Scrapy cho chapter {i+1}/{len(chapter_urls)}: {chapter_url}")
            
            # Run scrapy command for this chapter
            subprocess.run([
                "scrapy", "crawl", "monkey_content_crawler",
                "-a", f"url={chapter_url}",
                "-a", f"story_id={story_id}",
                "-a", f"chapter_index={i}"
            ])
            
            # Indicate progress
            print(f"Hoàn thành chapter {i+1}/{len(chapter_urls)}")
        
        print(f"Đã hoàn thành crawl nội dung cho truyện: {story_id}")
        print("-" * 40)

def update_stories_with_chapters(stories):
    chapters_dir = "chapters_content"
    
    if not os.path.exists(chapters_dir):
        print(f"{chapters_dir} không tồn tại. Hãy chạy crawler trước.")
        return stories
    
    updated_stories = stories.copy()
    
    # Process each story's chapters
    for story_id in os.listdir(chapters_dir):
        story_chapters_dir = os.path.join(chapters_dir, story_id)
        
        if not os.path.isdir(story_chapters_dir):
            continue
            
        if story_id not in updated_stories:
            print(f"Story ID {story_id} không tồn tại trong stories.json")
            continue
        
        # Initialize chapters list if not present
        if "chapters" not in updated_stories[story_id]:
            updated_stories[story_id]["chapters"] = []
        
        # Load each chapter file
        chapter_files = [f for f in os.listdir(story_chapters_dir) if f.endswith('.json')]
        print("DEBUG")
        print(chapter_files)
        chapter_files.sort(key=lambda x: int(x.split('_')[1].split('.')[0]))  # Sort by chapter number
        
        chapters = []
        for chapter_file in chapter_files:
            chapter_path = os.path.join(story_chapters_dir, chapter_file)
            
            try:
                with open(chapter_path, "r", encoding="utf-8") as f:
                    chapter_data = json.load(f)
                    chapters.append({
                        "title": chapter_data.get("title", ""),
                        "content": chapter_data.get("content", ""),
                        "url": chapter_data.get("url", "")
                    })
            except json.JSONDecodeError:
                print(f"Lỗi đọc file chapter {chapter_path}")
        
        # Update the stories with chapter data
        updated_stories[story_id]["chapters"] = chapters
        print(f"Đã cập nhật {len(chapters)} chapter cho truyện: {story_id}")
    
    return updated_stories

def main():
    stories_file = "stories.json"
    
    # Load existing stories
    stories = load_stories(stories_file)
    
    # Crawl chapter content
    crawl_chapter_content(stories)
    
    # Update stories with chapter content
    updated_stories = update_stories_with_chapters(stories)
    
    # Save updated stories
    save_stories(stories_file, updated_stories)
    print("Cập nhật stories.json thành công!")

if __name__ == "__main__":
    main()