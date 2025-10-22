import { ReactNode } from "react";

interface ScrollablePageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  variant?: "100" | "50";
}

export default function ScrollablePageLayout({
  header,
  children,
  variant = "50",
}: ScrollablePageLayoutProps) {

  const headerHeight = variant === "100" ? "100px" : "50px";

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Static Header */}
      <div style={{ height: headerHeight, minHeight: headerHeight }}>
        {header}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}