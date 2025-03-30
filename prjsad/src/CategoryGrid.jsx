import CategoryLink from "./CategoryLink";

export default function CategoryGrid() {
  const categories = {
    column1: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7993124160ff59b95d69e0c1f40980a0fc16d0df?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Bách Hợp",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7993124160ff59b95d69e0c1f40980a0fc16d0df?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Cung Đấu",
      },
      // Add more categories
    ],
    column2: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/eb8ce72c5fa1c5a4f2560269f4f3e5b3a82a91b7?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "BE",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/eb8ce72c5fa1c5a4f2560269f4f3e5b3a82a91b7?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Cưới Trước Yêu Sau",
      },
      // Add more categories
    ],
    column3: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4142dd2a8b550c17c3fe2e3141225d2d2047f465?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Chữa Lành",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4142dd2a8b550c17c3fe2e3141225d2d2047f465?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Cường Thủ Hào Đoạt",
      },
      // Add more categories
    ],
    column4: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3270530e517919545fb4ee2dd705dc555b79f665?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Cổ Đại",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3270530e517919545fb4ee2dd705dc555b79f665?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904",
        name: "Dị Năng",
      },
      // Add more categories
    ],
  };

  return (
    <section className="pb-20 w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
        <h2 className="self-start px-4 py-1.5 text-base font-bold tracking-wide text-white bg-blue-600 rounded-md">
          Thể Loại
        </h2>
        <button className="flex items-center px-3.5 pt-2.5 pb-3 rounded-md border border-blue-600">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb453652c4e82624a8c4bbcb7cfb9ce8f8eab767?placeholderIfAbsent=true&apiKey=741f47dd65dd4c5584bc71eba79f2904"
            alt="Filter"
            className="object-contain aspect-square w-[19px]"
          />
        </button>
      </div>
      <div className="pt-24 pr-80 pb-24 pl-14 mt-12 rounded-md border-solid border-2 border-blue-600 w-full max-md:pr-5 max-md:max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="flex flex-col gap-4">
            {categories.column1.map((category, index) => (
              <CategoryLink key={index} {...category} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {categories.column2.map((category, index) => (
              <CategoryLink key={index} {...category} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {categories.column3.map((category, index) => (
              <CategoryLink key={index} {...category} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {categories.column4.map((category, index) => (
              <CategoryLink key={index} {...category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
