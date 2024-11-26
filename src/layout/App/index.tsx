import "./index.css";
import PrayerBlockEditor from "../PrayerBlockEditor";
import PrayerBlockPreview from "../PrayerBlockPreview";

export default function App() {
  return (
    <div id="layout-app">
      <div id="left">
        <PrayerBlockEditor />
      </div>
      <div id="right">
        <PrayerBlockPreview />
      </div>
    </div>
  );
}
