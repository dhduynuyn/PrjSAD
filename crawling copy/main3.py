import json
import os

def load_stories(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def save_stories(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def update_stories_json_with_chapters():
    # Đường dẫn tới file stories.json
    stories_file = "stories.json"
    
    # Kiểm tra xem file có tồn tại không
    if not os.path.exists(stories_file):
        print(f"Không tìm thấy file {stories_file}")
        return
    
    # Load stories.json
    try:
        stories = load_stories(stories_file)
        print(f"Đã tải {len(stories)} truyện từ {stories_file}")
    except json.JSONDecodeError:
        print(f"Lỗi khi đọc file {stories_file}")
        return
    
    # Cập nhật từng truyện với dữ liệu chapter
    updated_count = 0
    for story_id in stories:
        # Đường dẫn tới thư mục chứa dữ liệu truyện
        story_dir = os.path.join("stories_info", story_id)
        chapters_dir = os.path.join(story_dir, "chapters")
        
        # Kiểm tra xem thư mục có tồn tại không
        if not os.path.exists(chapters_dir):
            print(f"Không tìm thấy thư mục chapters cho truyện {story_id}")
            continue
        
        # Lấy danh sách các file JSON của chapter
        chapter_files = [f for f in os.listdir(chapters_dir) if f.endswith('.json')]
        chapter_files.sort(key=lambda x: int(x.split('_')[1].split('.')[0]))  # Sắp xếp theo số chapter
        
        if not chapter_files:
            print(f"Không tìm thấy chapter nào cho truyện {story_id}")
            continue
        
        # Danh sách để lưu dữ liệu chapter
        chapters = []
        
        # Đọc từng file chapter
        for chapter_file in chapter_files:
            chapter_path = os.path.join(chapters_dir, chapter_file)
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
        
        # Cập nhật story với danh sách chapter
        if chapters:
            stories[story_id]["chapters"] = chapters
            print(f"Đã cập nhật {len(chapters)} chapter cho truyện {story_id}")
            updated_count += 1
    
    # Lưu lại file stories.json đã cập nhật
    save_stories(stories_file, stories)
    print(f"Đã cập nhật thành công {updated_count}/{len(stories)} truyện trong {stories_file}")

if __name__ == "__main__":
    update_stories_json_with_chapters()