export default function CategoryLink({ icon, name }) {
  return (
    <a
      href="#"
      className="flex items-center h-5 text-base font-bold tracking-wide leading-7 text-black hover:text-blue-600"
    >
      <img
        src={icon}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.07]"
      />
      <span className="self-stretch my-auto ml-2">{name}</span>
    </a>
  );
}
