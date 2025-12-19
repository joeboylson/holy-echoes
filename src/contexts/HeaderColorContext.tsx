import { createContext, useContext, ReactNode } from "react";
// import useSeasons from "@/hooks/useSeasons";

interface HeaderColorContextType {
  headerColor: string;
}

const HeaderColorContext = createContext<HeaderColorContextType | undefined>(
  undefined
);

export function HeaderColorProvider({ children }: { children: ReactNode }) {
  // NOTE: Season-based header color functionality commented out for now
  // This might be used later to dynamically change header colors based on liturgical seasons
  // const { currentSeason } = useSeasons();
  // const headerColor = currentSeason?.color ?? "#0082cb";

  const headerColor = "#0082cb";

  return (
    <HeaderColorContext.Provider value={{ headerColor }}>
      {children}
    </HeaderColorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHeaderColor() {
  const context = useContext(HeaderColorContext);
  if (context === undefined) {
    throw new Error("useHeaderColor must be used within a HeaderColorProvider");
  }
  return context;
}
