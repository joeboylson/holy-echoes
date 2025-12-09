import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  CaretLeft as CaretLeftIcon,
  CaretRight as CaretRightIcon,
} from "@phosphor-icons/react";
import FavoriteButton from "../FavoriteButton";
import { Button } from "@/components/ui/button";
import { useHeaderColor } from "@/contexts/HeaderColorContext";

interface NavigationHeaderProps {
  onPrevious?: () => void;
  onNext?: () => void;
  backTo: string;
  prayerId?: string;
}

export default function NavigationHeader({
  onPrevious,
  onNext,
  backTo,
  prayerId,
}: NavigationHeaderProps) {
  const navigate = useNavigate();
  const { headerColor } = useHeaderColor();

  return (
    <div
      className="w-full h-[50px] mx-auto grid grid-cols-[90px_1fr_72px] items-center px-6 shadow-lg z-10"
      style={{ backgroundColor: headerColor }}
    >
      <Button
        variant="ghost"
        onClick={() => navigate(backTo)}
        className="!text-white hover:!text-white hover:!bg-transparent hover:underline !justify-start !p-0 [&_svg]:!size-[28px] flex items-center text-[22px]"
      >
        <ArrowLeftIcon weight="bold" />
        <span className="font-bold pl-[4px] pt-[1px]">Back</span>
      </Button>

      <div className="flex justify-end px-[20px]">
        {prayerId && <FavoriteButton prayerId={prayerId} />}
      </div>

      <div className="grid grid-cols-[28px_28px] gap-[16px] items-center">
        {onPrevious ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="!bg-transparent !p-0 !h-[28px] !w-[28px] hover:!bg-transparent [&_svg]:!size-[28px]"
          >
            <CaretLeftIcon weight="bold" color="#FFFFFF" />
          </Button>
        ) : (
          <span />
        )}

        {onNext ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="!bg-transparent !p-0 !h-[28px] !w-[28px] hover:!bg-transparent [&_svg]:!size-[28px]"
          >
            <CaretRightIcon weight="bold" color="#FFFFFF" />
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
