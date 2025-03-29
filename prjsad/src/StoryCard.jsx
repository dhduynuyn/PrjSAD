export default function StoryCard({
  image,
  title,
  chapter,
  time,
  views,
  comments,
  isFull = false,
}) {
  return (
    <article className="flex flex-col pb-5 bg-white rounded-md shadow-md">
      {isFull && (
        <div className="z-10 self-end px-1.5 py-2 text-sm font-bold tracking-wide leading-none text-white uppercase whitespace-nowrap bg-red-600 rounded-md">
          FULL
        </div>
      )}
      <div className="flex flex-col justify-center mt-0">
        <img
          src={image}
          alt={title}
          className="object-contain max-w-full rounded-md aspect-[0.88] w-[230px]"
        />
      </div>
      <div className="flex z-10 items-center px-2.5 py-1 -mt-7 text-sm tracking-wide text-white opacity-80 bg-neutral-700">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e635bb993cc6dbf95e8a92e7a78bef4ba804c548?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
          alt=""
          className="w-3.5 aspect-[1.08]"
        />
        <span className="ml-1">{views}</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/168ccf35072fdb5963c4cb49152cef090f042fbb?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
          alt=""
          className="ml-2 w-6 aspect-[1.92]"
        />
        <span className="ml-1">{comments}</span>
      </div>
      <div className="flex flex-col mx-4 mt-4 tracking-wide">
        <h3 className="self-start py-px text-base font-medium leading-5 text-black">
          {title}
        </h3>
        <div className="flex gap-5 justify-between mt-2.5 text-xs">
          <span className="overflow-hidden text-black">{chapter}</span>
          <time className="text-right text-neutral-800">{time}</time>
        </div>
      </div>
    </article>
  );
}
