import Logo from "@/assets/he-textlogo-white.png";
import { useHeaderColor } from "@/contexts/HeaderColorContext";

export default function HomeHeader() {
  const { headerColor } = useHeaderColor();

  return (
    <div
      className="w-full h-[100px] mx-auto flex items-center justify-center gap-4 shadow-lg z-10"
      style={{ backgroundColor: headerColor }}
    >
      <img
        src={Logo}
        alt="Holy Echoes App Logo"
        className="w-full max-w-[250px]"
      />
    </div>
  );
}
