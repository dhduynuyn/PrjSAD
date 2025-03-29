export default function Pagination({ currentPage, totalPages }) {
  return (
    <nav
      className="flex items-start self-center mt-6 max-w-full w-[281px]"
      aria-label="Pagination"
    >
      <button
        className="self-stretch px-3.5 pt-3 pb-3 bg-gray-200 rounded-md border border-solid border-zinc-200"
        aria-label="Previous page"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/292ed59ca301723983f14e4c48a50cfb57d93bfc?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
          alt=""
          className="w-[17px] aspect-[1.06]"
        />
      </button>

      <button className="px-3.5 py-2 text-base tracking-wide text-center text-white whitespace-nowrap bg-blue-600 border border-blue-600 border-solid">
        1
      </button>

      <button className="px-3.5 py-2 text-base tracking-wide text-center text-blue-600 whitespace-nowrap bg-white border border-solid border-zinc-200">
        2
      </button>

      <button className="px-3.5 py-2 text-base tracking-wide text-center text-blue-600 whitespace-nowrap bg-white border border-solid border-zinc-200">
        3
      </button>

      <span className="px-3.5 py-2 text-base tracking-wide text-center whitespace-nowrap bg-gray-200 border border-solid border-zinc-200 text-neutral-800">
        ...
      </span>

      <button className="px-3.5 py-2 text-base tracking-wide text-center text-blue-600 whitespace-nowrap bg-white border border-solid border-zinc-200">
        405
      </button>

      <button
        className="self-stretch px-3.5 pt-3 pb-3 bg-white rounded-none border border-solid border-zinc-200"
        aria-label="Next page"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7781db6e81c0b6e08b3d8e9e85aeb9dda4fa8296?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
          alt=""
          className="w-[17px] aspect-[1.06]"
        />
      </button>
    </nav>
  );
}
