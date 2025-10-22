import { useNavigate } from "react-router-dom";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import FavoriteButton from "../FavoriteButton";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full h-[50px] mx-auto bg-[#0082cb] grid grid-cols-[90px_1fr_72px] items-center px-6 shadow-lg z-10">
      <Button
        variant="ghost"
        onClick={() => navigate(backTo)}
        className="!text-white hover:!text-white hover:!bg-transparent hover:underline !justify-start !p-0"
      >
        <ArrowLeft size={20} /> Back
      </Button>

      <div className="flex justify-end px-[20px]">
        {prayerId && <FavoriteButton prayerId={prayerId} />}
      </div>

      <div className="grid grid-cols-[24px_24px] gap-[24px] items-center h-6">
        {onPrevious ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="!bg-transparent !p-0 !h-[24px] !w-[24px] hover:!bg-transparent"
          >
            <CaretLeft size={24} weight="bold" color="#FFFFFF" />
          </Button>
        ) : (
          <span />
        )}

        {onNext ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="!bg-transparent !p-0 !h-[24px] !w-[24px] hover:!bg-transparent"
          >
            <CaretRight size={24} weight="bold" color="#FFFFFF" />
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
