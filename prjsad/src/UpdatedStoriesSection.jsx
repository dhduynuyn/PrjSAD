// src/components/UpdatedStoriesSection.js
import StoryCard from "./StoryCard";
import Pagination from "./Pagination";

export default function UpdatedStoriesSection() {
  // Dữ liệu mẫu đầy đủ hơn
  const stories = [
    {
      image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/27/1745690744-30-ngay-dem-nguoc-truoc-khi-toi-chet.jpg",
      title: "30 ngày đếm ngược trước khi tôi chết",
      chapter: "Góc nhìn của Sầm Ngọc",
      time: "44 phút trước",
      views: "68",
      bookmarks: "0",
      isFull: true,
      storyUrl: "https://monkeyd.net.vn/30-ngay-dem-nguoc-truoc-khi-toi-chet.html",
      chapterUrl: "https://monkeyd.net.vn/30-ngay-dem-nguoc-truoc-khi-toi-chet/goc-nhin-cua-sam-ngoc.html",
    },
    {
      image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745684769-ngay-xuan-den-muon.jpg",
      title: "Ngày xuân đến muộn",
      chapter: "Chương 9: Đua xe",
      time: "1 giờ trước",
      views: "13",
      bookmarks: "0",
      isFull: false,
      storyUrl: "https://monkeyd.net.vn/ngay-xuan-den-muon.html",
      chapterUrl: "https://monkeyd.net.vn/ngay-xuan-den-muon/chuong-9-dua-xe.html",
    },
    {
      image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745686522-tim-thay-em-o-bien-sao-troi.jpg",
      title: "Tìm thấy em ở biển sao trời",
      chapter: "Ngoại truyện",
      time: "1 giờ trước",
      views: "89",
      bookmarks: "0",
      isFull: true,
       storyUrl: "https://monkeyd.net.vn/tim-thay-em-o-bien-sao-troi.html",
      chapterUrl: "https://monkeyd.net.vn/tim-thay-em-o-bien-sao-troi/ngoai-truyen.html",
    },
    {
      image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/03/26/1742987382-anh-duong-khong-hoen-gi.jpg",
      title: "Ánh Dương Không Hoen Gỉ",
      chapter: "Chương 7: Em Gái Nhỏ Của Anh",
      time: "1 giờ trước",
      views: "25",
      bookmarks: "3",
      isFull: false,
      storyUrl: "https://monkeyd.net.vn/anh-duong-khong-hoen-gi.html",
      chapterUrl: "https://monkeyd.net.vn/anh-duong-khong-hoen-gi/chuong-7-em-gai-nho-cua-anh.html",
    },
     {
      image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745685375-xuat-duong-than.jpg",
      title: "Xuất Dương Thần",
      chapter: "Chương 39: Người Phụ Nữ",
      time: "2 giờ trước",
      views: "0",
      bookmarks: "0",
      isFull: false,
      storyUrl: "https://monkeyd.net.vn/xuat-duong-than.html",
      chapterUrl: "https://monkeyd.net.vn/xuat-duong-than/chuong-39-nguoi-phu-nu.html",
    },
    {
        image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745684866-sau-khi-ly-hon.jpg",
        title: "SAU KHI LY HÔN",
        chapter: "15 - HẾT",
        time: "2 giờ trước",
        views: "328",
        bookmarks: "1",
        isFull: true,
        storyUrl: "https://monkeyd.net.vn/sau-khi-ly-hon.html",
        chapterUrl: "https://monkeyd.net.vn/sau-khi-ly-hon/15-het.html",
    },
     {
        image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745684699-ha-hoa.jpg",
        title: "Hạ Hòa",
        chapter: "Chương 6",
        time: "2 giờ trước",
        views: "136",
        bookmarks: "1",
        isFull: true,
        storyUrl: "https://monkeyd.net.vn/ha-hoa.html",
        chapterUrl: "https://monkeyd.net.vn/ha-hoa/chuong-6.html",
    },
    {
        image: "https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745633890-co-dai-su-xuyen-khong-roi.jpg",
        title: "Cố Đại Sư Xuyên Không Rồi!",
        chapter: "Chương 39",
        time: "2 giờ trước",
        views: "88",
        bookmarks: "1",
        isFull: false,
        storyUrl: "https://monkeyd.net.vn/co-dai-su-xuyen-khong-roi.html",
        chapterUrl: "https://monkeyd.net.vn/co-dai-su-xuyen-khong-roi/chuong-39.html",
    },
    // Thêm các truyện khác nếu muốn test nhiều hơn
  ];

 // Lấy page hiện tại từ URL (ví dụ)
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page') || '1', 10);
  const totalPages = 451; // Lấy từ dữ liệu thực tế hoặc API

  return (
     // Thêm container giống Bootstrap container
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-4"> {/* Giống py-4 của Bootstrap */}
        {/* Tiêu đề và divider */}
        <h2 className="text-lg font-semibold tracking-wide leading-tight uppercase text-gray-800 mb-0">
          Truyện mới cập nhật
        </h2>
        <hr className="mt-2 mb-4 border-t border-gray-300"/> {/* Giống <hr> */}

        {/* Grid truyện */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"> {/* Responsive grid */}
          {/* Nên lấy dữ liệu stories từ API theo page hiện tại */}
          {stories.map((story, index) => (
            <StoryCard key={index} {...story} />
          ))}
        </div>

        {/* Phân trang */}
        <div className="mt-6 flex justify-center"> {/* Căn giữa pagination */}
           <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </div>
  );
}