import React from 'react';
import StoryCard from './StoryCard'; // Đảm bảo đường dẫn đúng

// Dữ liệu mẫu (Thêm nhiều truyện và các thuộc tính URL)
const completedStoriesData = [
  {
    id: 1, // Thêm ID duy nhất cho key
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/27/1745690744-30-ngay-dem-nguoc-truoc-khi-toi-chet.jpg',
    title: '30 ngày đếm ngược trước khi tôi chết',
    chapter: 'Góc nhìn của Sầm Ngọc',
    time: '44 phút trước',
    views: '68',
    bookmarks: '0',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/30-ngay-dem-nguoc-truoc-khi-toi-chet.html',
    chapterUrl: 'https://monkeyd.net.vn/30-ngay-dem-nguoc-truoc-khi-toi-chet/goc-nhin-cua-sam-ngoc.html',
  },
  {
    id: 2,
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745686522-tim-thay-em-o-bien-sao-troi.jpg',
    title: 'Tìm thấy em ở biển sao trời',
    chapter: 'Ngoại truyện',
    time: '1 giờ trước',
    views: '89',
    bookmarks: '0',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/tim-thay-em-o-bien-sao-troi.html',
    chapterUrl: 'https://monkeyd.net.vn/tim-thay-em-o-bien-sao-troi/ngoai-truyen.html',
  },
  {
    id: 3,
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745684866-sau-khi-ly-hon.jpg',
    title: 'SAU KHI LY HÔN',
    chapter: '15 - HẾT',
    time: '2 giờ trước',
    views: '328',
    bookmarks: '1',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/sau-khi-ly-hon.html',
    chapterUrl: 'https://monkeyd.net.vn/sau-khi-ly-hon/15-het.html',
  },
  {
    id: 4,
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745684699-ha-hoa.jpg',
    title: 'Hạ Hòa',
    chapter: 'Chương 6',
    time: '2 giờ trước',
    views: '136',
    bookmarks: '1',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/ha-hoa.html',
    chapterUrl: 'https://monkeyd.net.vn/ha-hoa/chuong-6.html',
  },
   {
    id: 5,
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745643207-ke-hoach-phan-cong.jpg',
    title: 'Kế hoạch phản công',
    chapter: 'Chương cuối',
    time: '2 giờ trước',
    views: '115',
    bookmarks: '2',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/ke-hoach-phan-cong.html',
    chapterUrl: 'https://monkeyd.net.vn/ke-hoach-phan-cong/chuong-cuoi.html',
  },
   {
    id: 6,
    image: 'https://cdn.monkeydarchive.com/images/story/thumbs/230/2025/04/26/1745676402-em-ho-tham-lam-chi-day-khong-ngan.jpg',
    title: 'Em Họ Tham Lam, Chị Đây Không Ngán!',
    chapter: 'Chương 7',
    time: '4 giờ trước',
    views: '4,284',
    bookmarks: '2',
    isFull: true,
    storyUrl: 'https://monkeyd.net.vn/em-ho-tham-lam-chi-day-khong-ngan.html',
    chapterUrl: 'https://monkeyd.net.vn/em-ho-tham-lam-chi-day-khong-ngan/chuong-7.html',
  },
  // Thêm nhiều truyện khác vào đây...
  // ...
];

export default function CompletedStoriesSection() {
  // URL cho nút Xem thêm chính
  const viewMoreUrl = 'https://monkeyd.net.vn/truyen-hoan-thanh.html';

  return (
    // mt-5 của Bootstrap tương đương mt-5 hoặc mt-6 trong Tailwind (tuỳ config)
    <section className="mt-6 md:mt-8"> {/* Tăng margin top */}
      {/* Phần Header: Title và nút Xem thêm */}
      <div className="flex flex-wrap gap-y-2 items-center justify-between mb-2"> {/* Căn chỉnh và khoảng cách */}
        <h5 className="text-lg md:text-xl font-medium uppercase text-gray-700 tracking-wide mb-0"> {/* Tăng cỡ chữ */}
          Truyện đã hoàn thành
        </h5>
        {/* Nút Xem thêm - dùng thẻ <a> nếu là link điều hướng */}
        <a
          href={viewMoreUrl}
          // Style giống btn-outline-primary radius-30 btn-sm
          className="px-3 py-1 text-xs md:text-sm font-medium text-sky-600 border border-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-colors duration-200"
        >
          Xem thêm
        </a>
      </div>

      {/* Đường kẻ ngang */}
      <hr className="border-t border-gray-300 mb-4" /> {/* Đường kẻ rõ hơn */}

      {/* Lưới truyện */}
      {/* Grid:
          - Mặc định 2 cột (giống col-4 trên mobile)
          - Từ sm (640px): 3 cột
          - Từ md (768px): 4 cột (giống col-md-3)
          - Từ lg (1024px): 6 cột (hiển thị nhiều hơn trên màn lớn)
          - gap-3 hoặc gap-4 cho khoảng cách giữa các card
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {completedStoriesData.map((story) => (
          // Sử dụng id làm key
          <StoryCard key={story.id} {...story} />
        ))}
      </div>

       {/* Nút Xem thêm ở cuối (nếu danh sách dài và cần phân trang/load more) */}
       {/* Bạn có thể hiển thị nút này có điều kiện */}
       <div className="text-center mt-6 mb-4">
          <a
            href={viewMoreUrl}
            className="inline-block px-5 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors duration-200"
          >
            Xem thêm truyện hoàn thành
          </a>
       </div>
    </section>
  );
}