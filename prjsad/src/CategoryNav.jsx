export default function CategoryNav() {
  return (
    <nav className="pt-10 pb-11 text-6xl border-solid shadow-sm bg-white border-b-[1px] border-b-[#E4E4E4] font-normal px-[312px] text-black tracking-[0.5px] w-full max-md:px-5">
      <div className="flex flex-wrap flex-1 shrink gap-1.5 pr-20 pl-px basis-0 min-w-60 size-full max-md:pr-5">
        <div className="flex flex-auto gap-px items-center">
          <a
            href="#"
            className="self-stretch px-3 py-1 my-auto rounded-md hover:bg-gray-100"
          >
            Trang chủ
          </a>
          <a
            href="#"
            className="self-stretch px-3 py-1 my-auto rounded-md hover:bg-gray-100"
          >
            Truyện mới
          </a>
          <button className="flex gap-2 items-center self-stretch px-3 py-2 rounded-md hover:bg-gray-100">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2cd1e29281e49fa367a8bdde26938aad130b4e6?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt=""
              className="w-[21px] aspect-[1.05]"
            />
            <span>Thể loại</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8382b617550d26a2c36ee251e611feeaa130db62?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt=""
              className="w-4 aspect-square"
            />
          </button>
        </div>
        <div className="flex flex-wrap flex-auto max-md:max-w-full">
          <a
            href="#"
            className="self-stretch px-3 py-1 my-auto rounded-md hover:bg-gray-100"
          >
            Truyện Full
          </a>
          <a
            href="#"
            className="self-stretch px-3 py-1 my-auto rounded-md hover:bg-gray-100"
          >
            Truyện Dài
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0084fe4aed8936ec32bfc6c459db69800b0d66f6?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt=""
              className="w-5 aspect-square mr-2"
            />
            Truyện Sáng Tác
          </a>
          <a
            href="#"
            className="flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c01e7daeb75ce0fbc423d9550b304081fb99bd87?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt=""
              className="w-[21px] aspect-[1.05]"
            />
            Team
          </a>
          <a
            href="#"
            className="flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/447285ae86907b5e0d6137ad9faf335ebf1bf477?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt=""
              className="w-[21px] aspect-[1.05]"
            />
            Nghe Audio
          </a>
        </div>
      </div>
    </nav>
  );
}
