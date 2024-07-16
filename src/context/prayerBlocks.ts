import { createContext, useContext } from "react";
import { prayerBlockContextDefaultValue } from "../hooks/usePrayerBlocks";

export const PrayerBlockContext = createContext(prayerBlockContextDefaultValue);
export const PrayerBlockProvider = PrayerBlockContext.Provider;

export const usePrayerBlockContext = () => useContext(PrayerBlockContext);
