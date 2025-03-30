"use client";
import React from "react";

export default function Header() {
  return (
    <header className="justify-start items-center border-solid border-b-[1px] border-b-[#F0F0F0] bg-white flex h-[60px] w-full px-[400px] pb-[1px] max-md:px-5">
      <nav className="flex flex-row w-14 flex-none shrink gap-5 justify-start self-stretch px-6 my-auto w-full basis-0 max-w-[1320px] min-w-60 max-md:px-5">
        <div className="flex flex-nowrap gap-4 max-md:max-w-full">
          <div className="items-start border-solid border-r-[1px] border-r-[#F0F0F0] flex min-h-[60px] pr-[21px] py-[15px]">
            <div className="flex flex-col justify-center self-stretch my-auto w-[120px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a52c1448950e884661b826d947e970eb22a3e3b?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                alt="Website Logo"
                className="object-contain w-full aspect-[3.88]"
              />
            </div>
          </div>
          <div className="grow shrink-0 py-0.5 my-auto text-xl text-black basis-0 w-fit">
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm truyện"
                className="pr-36 pl-48 rounded-lg border-solid bg-white border border-[#DEE2E6] w-40 max-md:px-5"
                aria-label="Search stories"
              />
              <button
                aria-label="Search"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c59ef70897f9baffff032bfd84ed7b9ae0f1f5e2?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
                  alt=""
                  className="w-[25px] aspect-square"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4 my-auto">
          <button className="flex justify-center items-center p-2.5 rounded-3xl min-h-[42px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/460ebbbfb1f5fd0be1ea0a42e1357c0160b34dfd?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
              alt="Notifications"
              className="w-[22px] aspect-square"
            />
          </button>
          <div className="flex gap-1.5 my-auto text-sm tracking-wide text-center text-white">
            <button className="px-2.5 py-1.5 bg-sky-500 rounded border border-sky-500 min-h-[30px]">
              Đăng nhập
            </button>
            <button className="px-2.5 py-1.5 bg-sky-500 rounded border border-sky-500 min-h-[30px]">
              Đăng ký
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
