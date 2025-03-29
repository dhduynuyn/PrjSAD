export default function RankingCard({
  rank,
  image,
  title,
  stats,
  time,
  topRank,
}) {
  return (
    <div className="items-start border-solid border-b-[1px] border-b-[#DDD] flex w-full px-[14px] py-[8px] gap-[14px]">
      <span className="text-lg font-bold text-center leading-[60px] text-neutral-800">
        {rank}
      </span>
      <img
        src={image}
        alt={title}
        className="object-contain aspect-[0.92] rounded-[30px] w-[55px]"
      />
      <div className="flex flex-col self-stretch min-h-[60px] w-[169px]">
        <h4 className="text-sm font-medium leading-snug text-black">{title}</h4>
        <div className="flex mt-3 text-xs text-neutral-800">
          <img src={stats.icon} alt="" className="w-3 aspect-square" />
          <span className="ml-1">{stats.count}</span>
        </div>
        {topRank && (
          <span className="self-end mt-0 text-xs text-neutral-800">
            {topRank}
          </span>
        )}
      </div>
    </div>
  );
}
