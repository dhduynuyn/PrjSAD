export default function Footer() {
  return (
    <footer className="border-solid border-t-[1px] border-t-[#E4E4E4] bg-white flex w-full px-7 pt-16 pb-7 flex-col overflow-hidden">
      <div className="self-center max-w-full w-[1298px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="px-3 min-h-[193px]">
            <div className="flex flex-col items-start max-w-full w-[636px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/h8f3c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                alt="MonkeyD Logo"
                className="object-contain max-w-full aspect-[3.8] w-[300px]"
              />
            </div>
            <address className="mt-4 text-sm tracking-wide text-zinc-600 not-italic">
              Email: monkeyd.contact@gmail.com
            </address>
            <p className="mt-4 text-sm tracking-wide text-zinc-600">
              Liên hệ hỗ trợ:{" "}
              <a
                href="https://www.fb.com/monkeyd.vn"
                className="hover:text-blue-600"
              >
                https://www.fb.com/monkeyd.vn
              </a>
            </p>
            <div className="flex flex-col justify-center mt-4 max-w-full w-[121px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/i8f3c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                alt="Social Media Icons"
                className="object-contain w-full aspect-[5.05]"
              />
            </div>
          </div>
          <div className="flex flex-col text-sm tracking-wide">
            <p className="leading-5 text-zinc-600">
              Mọi thông tin và hình ảnh trên website đều được bên thứ ba đăng
              tải, MonkeyD miễn trừ mọi
              <br />
              trách nhiệm liên quan đến các nội dung trên website này. Nếu làm
              ảnh hưởng đến cá nhân hay
              <br />
              tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay
              lập tức. Các vấn đề liên
              <br />
              quan đến bản quyền hoặc thắc mắc khác, vui lòng liên hệ fanpage:{" "}
              <span className="text-black">MonkeyD</span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-solid border-t-[1px] border-t-[#DEE2E6] mt-8 px-20 py-4 text-center font-['Roboto'] text-sm tracking-[0.5px] max-md:px-5">
        <nav className="flex flex-col max-w-full w-[416px] mx-auto">
          <ul className="flex gap-2 w-full justify-center">
            <li>
              <a
                href="#"
                className="font-bold text-black hover:text-blue-600"
                aria-label="Chính sách và quy định chung"
              >
                Chính sách và quy định chung
              </a>
            </li>
            <li className="text-zinc-600">-</li>
            <li>
              <a
                href="#"
                className="font-bold text-black hover:text-blue-600"
                aria-label="Chính sách bảo mật"
              >
                Chính sách bảo mật
              </a>
            </li>
            <li className="text-zinc-600">-</li>
            <li>
              <a
                href="#"
                className="font-bold text-black hover:text-blue-600"
                aria-label="Sitemap"
              >
                Sitemap
              </a>
            </li>
          </ul>
          <p className="mt-1.5 text-zinc-600">
            Copyright © {new Date().getFullYear()}. All right reserved.
          </p>
        </nav>
      </div>
    </footer>
  );
}
