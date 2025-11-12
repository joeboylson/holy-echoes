import Logo from "@/assets/he-icon-white.png";

type HomeHeaderProps = {
  color?: string;
};

export default function HomeHeader({ color = "#0082cb" }: HomeHeaderProps) {
  return (
    <div
      className="w-full h-[100px] mx-auto flex items-center justify-center gap-4 shadow-lg z-10"
      style={{ backgroundColor: color }}
    >
      <img src={Logo} alt="Holy Echoes App Logo" className="!w-[60px] !h-[60px] object-contain" />
      <div className="flex flex-col">
        <h1 className="text-white text-2xl font-bold m-0 leading-tight">Holy Echoes</h1>
        <p className="text-white text-sm m-0 leading-tight">Traditional Catholic Prayers</p>
      </div>
    </div>
  );
}
