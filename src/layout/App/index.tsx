import "./index.css";
import PrayerBlockEditor from "../PrayerBlockEditor";
import PrayerBlockPreview from "../PrayerBlockPreview";
import PrayerList from "../PrayerList";

export default function App() {
  return (
    <div id="layout-app">
      <PrayerList />
      <div id="left">
        <PrayerBlockEditor />
      </div>
      <div id="right">
        <PrayerBlockPreview />
      </div>
    </div>
  );
}
