import { useNavigate } from "react-router-dom";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";

interface NavigationHeaderProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function NavigationHeader({
  onPrevious,
  onNext,
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[50px] mx-auto bg-[#0082cb] grid grid-cols-[90px_1fr_72px] items-center px-6 shadow-lg z-10">
      <button
        onClick={() => navigate(-1)}
        className="!flex items-center gap-2 !text-white no-underline font-medium hover:underline !bg-transparent !border-none cursor-pointer"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div></div>

      <div className="grid grid-cols-[24px_24px] gap-[24px] items-center h-6">
        {onPrevious ? (
          <button
            onClick={onPrevious}
            className="!bg-transparent !border-none cursor-pointer !p-0 !h-[24px]"
          >
            <CaretLeft size={24} weight="bold" color="#FFFFFF" />
          </button>
        ) : (
          <span />
        )}

        {onNext ? (
          <button
            onClick={onNext}
            className="!bg-transparent !border-none cursor-pointer !p-0 !h-[24px]"
          >
            <CaretRight size={24} weight="bold" color="#FFFFFF" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
