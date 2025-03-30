from flask import Flask, request, jsonify
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from crawling.spiders.monkey_chapter_content import MonkeyStoryCrawler
from flask_cors import CORS
import urllib.parse
from scrapy import signals
from scrapy.signalmanager import dispatcher

app = Flask(__name__)
CORS(app)  # Allow CORS

def run_spider(url):
    """Runs Scrapy spider and returns results."""
    process = CrawlerProcess(get_project_settings())
    results = []
    
    # Connect the item scraped signal
    def crawler_results(item, response, spider):
        print("Item scraped:", item)
        results.append(item)
    
    # Connect the signal to the dispatcher
    dispatcher.connect(crawler_results, signal=signals.item_scraped)
    
    process.crawl(MonkeyStoryCrawler, url=url)
    process.start()  # Blocking call
    
    return results
@app.route('/crawl', methods=['POST'])
def crawl_data():
    # Get URL from JSON request
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({
            "error": "Missing URL parameter",
            "status": 400
        }), 400
        
    url = data['url']
    
    # Validate URL
    if not url.startswith(('http://', 'https://')):
        return jsonify({
            "error": "Invalid URL format. URL must start with http:// or https://",
            "status": 400
        }), 400
    
    try:
        # Run spider and get results
        results = run_spider(url)
        
        if not results:
            return jsonify({
                "error": "No data found at the provided URL",
                "status": 404
            }), 404
            
        return jsonify({
            "data": results,
            "status": 200
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error occurred while crawling: {str(e)}",
            "status": 500
        }), 500

# You can also add a GET endpoint for testing in browsers
@app.route('/crawl', methods=['GET'])
def crawl_form():
    url = request.args.get('url', '')
    
    if not url:
        return jsonify({
            "error": "Missing URL parameter",
            "status": 400
        }), 400
        
    # Validate URL
    if not url.startswith(('http://', 'https://')):
        return jsonify({
            "error": "Invalid URL format. URL must start with http:// or https://",
            "status": 400
        }), 400
    
    try:
        # Run spider and get results
        results = run_spider(url)
        
        if not results:
            return jsonify({
                "error": "No data found at the provided URL",
                "status": 404
            }), 404
            
        return jsonify({
            "data": results,
            "status": 200
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Error occurred while crawling: {str(e)}",
            "status": 500
        }), 500

# Add this at the end of your file
if __name__ == '__main__':
    app.run(debug=True)