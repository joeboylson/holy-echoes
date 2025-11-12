import { SpinnerIcon } from "@phosphor-icons/react";

export default function LoadingIcon() {
  return (
    <div className="py-6 animate-spin" data-id="LoadingIcon">
      <SpinnerIcon size={32} />
    </div>
  );
}
