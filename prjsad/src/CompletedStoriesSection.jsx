import StoryCard from "./StoryCard";

export default function CompletedStoriesSection() {
  const completedStories = [
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
    // Add more completed stories data here
  ];

  return (
    <section className="mt-12">
      <div className="flex flex-wrap gap-5 justify-between tracking-wide">
        <h2 className="text-xl font-medium leading-tight uppercase text-neutral-700">
          Truyện đã hoàn thành
        </h2>
        <button className="px-2.5 py-1.5 text-sm text-center text-sky-500 border border-sky-500 border-solid rounded-[30px]">
          Xem thêm
        </button>
      </div>
      <div className="border-solid border-t-[1px] border-t-[#4C5258] opacity-25 mt-2 h-[1px]" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
        {completedStories.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
    </section>
  );
}
