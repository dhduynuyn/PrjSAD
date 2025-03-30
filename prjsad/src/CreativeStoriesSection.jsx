export default function CreativeStoriesSection() {
  return (
    <section className="mt-16">
      <div className="flex flex-wrap gap-5 justify-between tracking-wide">
        <h2 className="flex text-xl font-medium leading-tight uppercase text-neutral-700">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b6e06a31eebec656b6d29b286d475e4e59782089?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
            alt=""
            className="object-contain shrink-0 self-start aspect-[1.05] w-[21px]"
          />
          <span className="ml-2">Truyện Sáng Tác</span>
        </h2>
        <button className="px-2.5 py-1.5 text-sm text-center text-sky-500 border border-sky-500 border-solid rounded-[30px]">
          Xem thêm
        </button>
      </div>
      <div className="border-solid border-t-[1px] border-t-[#4C5258] opacity-25 mt-2 h-[1px]" />
      <div className="flex flex-wrap px-7 py-6 mt-4 bg-white rounded-md shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="flex flex-col">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4366e37064f746349d6f6c730ffa864068c3803?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="Thích Thầm"
              className="object-contain rounded-lg aspect-[0.75] w-[166px]"
            />
            <h3 className="mt-2 text-base font-medium tracking-wide leading-tight text-black">
              Thích Thầm
            </h3>
          </div>
          <div className="flex flex-col">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8f2c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="[Đam mỹ] Dụ Khởi"
              className="object-contain rounded-lg aspect-[0.75] w-[166px]"
            />
            <h3 className="mt-2 text-base font-medium tracking-wide leading-tight text-black">
              [Đam mỹ] Dụ Khởi
            </h3>
          </div>
          <div className="flex flex-col">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e8f3c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="Thâm Tình Lặng Lẽ"
              className="object-contain rounded-lg aspect-[0.75] w-[166px]"
            />
            <h3 className="mt-2 text-base font-medium tracking-wide leading-tight text-black">
              Thâm Tình Lặng Lẽ
            </h3>
          </div>
          <div className="flex flex-col">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f8f3c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="Ánh Dương Không Hoen Gỉ"
              className="object-contain rounded-lg aspect-[0.75] w-[166px]"
            />
            <h3 className="mt-2 text-base font-medium tracking-wide leading-5 text-black">
              Ánh Dương Không
              <br />
              Hoen Gỉ
            </h3>
          </div>
          <div className="flex flex-col">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/g8f3c5d5f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="Vết Nứt Con Tim"
              className="object-contain rounded-lg aspect-[0.75] w-[166px]"
            />
            <h3 className="mt-2 text-base font-medium tracking-wide leading-tight text-black">
              Vết Nứt Con Tim
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
