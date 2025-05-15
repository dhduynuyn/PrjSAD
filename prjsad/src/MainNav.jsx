import { Link } from "react-router-dom";

export default function MainNav() {
    return (
      <nav className="pt-10 pb-11 text-6xl border-solid shadow-sm bg-white border-b-[1px] border-b-[#E4E4E4] font-[400] px-[312px] text-black tracking-[0.5px] w-full max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap flex-1 shrink gap-1.5 pr-20 pl-px basis-0 min-w-60 size-full max-md:pr-5 max-md:max-w-full">
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
                className="object-contain shrink-0 self-stretch my-auto aspect-[1.05] w-[21px]"
                alt=""
              />
              <span>Thể loại</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8382b617550d26a2c36ee251e611feeaa130db62?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt=""
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
              className="flex items-center px-3 pt-2 pb-2 rounded-md hover:bg-gray-100"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0084fe4aed8936ec32bfc6c459db69800b0d66f6?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                alt=""
              />
              <span>Truyện Sáng Tác</span>
            </a>
            <a
              href="#"
              className="flex gap-2 items-center px-3 py-2 whitespace-nowrap rounded-md hover:bg-gray-100"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c01e7daeb75ce0fbc423d9550b304081fb99bd87?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                className="object-contain shrink-0 self-stretch my-auto aspect-[1.05] w-[21px]"
                alt=""
              />
              <span>Team</span>
            </a>

            <li className="nav-item">
              <Link
                to="/tim-kiem-nang-cao"
                className="nav-link px-3 py-2 flex items-center rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150"
              >
                Tìm kiếm nâng cao
              </Link>
            </li>


            <a
              href="#"
              className="flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/447285ae86907b5e0d6137ad9faf335ebf1bf477?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                className="object-contain shrink-0 self-stretch my-auto aspect-[1.05] w-[21px]"
                alt=""
              />
              <span>Nghe Audio</span>
            </a>
          </div>
        </div>
      </nav>
    );
  }
  