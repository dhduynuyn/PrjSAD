export default function FeaturedSection() {
  return (
    <section>
      <h2 className="z-10 self-start text-xl font-medium tracking-wide leading-tight uppercase text-neutral-700">
        Đề cử hôm nay
      </h2>
      <div className="border-solid border-t-[1px] border-t-[#4C5258] opacity-25 mt-[21px] h-[1px]" />
      <div className="flex flex-wrap px-7 py-6 mt-4 mb-0 bg-white rounded-md shadow-md max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
        <div className="flex flex-col max-md:max-w-full">
          <div className="max-w-full w-[590px]">
            <div className="flex gap-5 max-md:flex-col">
              <div className="w-[17%] max-md:ml-0 max-md:w-full">
                <div className="grow max-md:mt-3">
                  <div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/5280fb55f4eb695c598f37322af43194869be516?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt="Featured Story 1"
                      className="object-contain w-24 rounded-md aspect-[0.75]"
                    />
                  </div>
                  <div className="mt-2">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/f768f3248e2bb903ee20359fa83fc31b37ca1dee?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt="Featured Story 2"
                      className="object-contain w-24 rounded-md aspect-[0.75]"
                    />
                  </div>
                  <div className="mt-2">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f76a18cf02f259cd86546b0b409ec17ff997ba3?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt="Featured Story 3"
                      className="object-contain w-24 rounded-md aspect-[0.75]"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-5 w-[83%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col items-start w-full text-sm tracking-wide text-slate-700 max-md:mt-3.5 max-md:max-w-full">
                  <h3 className="font-bold">Ba Mẹ Của Tôi</h3>
                  <p className="overflow-hidden self-stretch pr-4 mt-2 leading-5 text-gray-500 max-md:max-w-full">
                    Edit: Yêu Phi Ngày nhận nuôi tôi, những người xung quanh đều
                    thở dài với ba mẹ tôi: "Nuô..
                  </p>
                  <div className="flex gap-1.5 items-center mt-3">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/eae617336961e44596391d7a63ae46751367b625?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto aspect-[1.07] w-[15px]"
                    />
                    <span className="self-stretch my-auto">
                      Yêu Phi Họa Quốc
                    </span>
                  </div>

                  <h3 className="mt-8 font-bold">Ba Năm Lãnh Cung</h3>
                  <p className="overflow-hidden self-stretch pr-1 mt-2 leading-5 text-gray-500 max-md:max-w-full">
                    Vào năm thứ ba ta ở lãnh cung, phế hậu đã chết. Ta thay y
                    phục sạch sẽ cho nàng, sửa sang lại..
                  </p>
                  <div className="flex gap-1.5 items-center mt-3">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/eae617336961e44596391d7a63ae46751367b625?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto aspect-[1.07] w-[15px]"
                    />
                    <span className="self-stretch my-auto">Đêm Đã Tàn Rồi</span>
                  </div>

                  <h3 className="mt-8 font-bold">KHƯỚC THƯỢNG TÂM ĐẦU</h3>
                  <p className="overflow-hidden self-stretch pr-6 mt-2 leading-5 text-gray-500 max-md:pr-5 max-md:max-w-full">
                    Vì muốn trút giận thay cho người trong lòng, Bùi Vân Châu đã
                    nhốt ta trong viện hoang sau khi ch..
                  </p>
                  <div className="flex gap-1.5 items-center mt-3">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/eae617336961e44596391d7a63ae46751367b625?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto aspect-[1.07] w-[15px]"
                    />
                    <span className="self-stretch my-auto">
                      Mắm Muối Chanh Đường
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex self-end mt-2.5 w-12">
            <button
              className="flex flex-1 items-start px-2 py-1.5"
              aria-label="Page 1"
            >
              <div className="flex w-2.5 h-2.5 bg-neutral-400 min-h-2.5 rounded-[30px]" />
            </button>
            <button
              className="flex flex-1 items-start px-2 py-1.5"
              aria-label="Page 2"
            >
              <div className="flex w-2.5 h-2.5 bg-zinc-300 min-h-2.5 rounded-[30px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
