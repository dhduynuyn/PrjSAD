export default function CategoryTag({ icon, label }) {
    return (
      <a href="#" className="flex items-center h-5 hover:text-blue-600">
        <img
          src={icon}
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.07]"
          alt=""
        />
        <span className="self-stretch my-auto ml-2 text-base font-bold tracking-wide leading-7">
          {label}
        </span>
      </a>
    );
  }
  