import Logo from "@/assets/he-icon-white.png";

export default function HomeHeader() {
  return (
    <div className="w-full h-[100px] mx-auto bg-[#0082cb] flex items-center justify-center gap-4 shadow-lg z-10">
      <img src={Logo} alt="Holy Echoes App Logo" className="!w-[60px] !h-[60px] object-contain" />
      <div className="flex flex-col">
        <h1 className="text-white text-2xl font-bold m-0 leading-tight">Holy Echoes</h1>
        <p className="text-white text-sm m-0 leading-tight">Traditional Catholic Prayers</p>
      </div>
    </div>
  );
}
