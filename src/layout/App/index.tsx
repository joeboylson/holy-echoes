import "./index.css";
import { PrayerBlockProvider } from "../../context/prayerBlocks";
import { usePrayerBlocks } from "../../hooks/usePrayerBlocks";
import PrayerBlockEditor from "../PrayerBlockEditor";
import PrayerBlockPreview from "../PrayerBlockPreview";

export default function App() {
  const prayerBlockProviderValue = usePrayerBlocks();

  return (
    <PrayerBlockProvider value={prayerBlockProviderValue}>
      <div id="layout-app">
        <div id="left">
          <PrayerBlockEditor />
        </div>
        <div id="right">
          <PrayerBlockPreview />
        </div>
        {/* <PrayerBlockJSONViewer /> */}
      </div>
    </PrayerBlockProvider>
  );
}
