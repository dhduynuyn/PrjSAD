import StoryCard from "./StoryCard";
import Pagination from "./Pagination";

export default function UpdatedStoriesSection() {
  const stories = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6a1ccc2b6567b28039930fc7a370ab7e2d12b842?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
      title: "Người Hầu Gia Chọn Là Ta",
      chapter: "Chương 26 (Hoàn)",
      time: "35 phút trước",
      views: "177",
      comments: "1",
      isFull: true,
    },
    // Add more stories data here
  ];

  return (
    <section className="mt-12">
      <h2 className="text-xl font-medium tracking-wide leading-tight uppercase text-neutral-700">
        Truyện mới cập nhật
      </h2>
      <div className="border-solid border-t-[1px] border-t-[#4C5258] opacity-25 mt-4 h-[1px]" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
        {stories.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
      <div className="mt-6">
        <Pagination currentPage={1} totalPages={405} />
      </div>
    </section>
  );
}
