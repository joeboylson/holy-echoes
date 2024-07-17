import "./index.css";
import { JSONTree } from "react-json-tree";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import { DownloadSimple, X } from "@phosphor-icons/react";
import { ChangeEvent, useCallback, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";

interface _props {
  visible: boolean;
  setVisible: (_visible: boolean) => void;
}

export default function PrayerBlockJSONViewer({ visible, setVisible }: _props) {
  const [filename, setFileName] = useState<string>("new-prayer");

  const handleFileNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // transform input

    const rawValue = event.target.value;
    const transformValue = rawValue
      .replace(/[^a-z0-9_ ]+/gi, "-")
      .replace(/^-|-$/g, "")
      .replace(" ", "-")
      .replace("--", "-")
      .toLowerCase();

    if (transformValue.endsWith("-"))
      setFileName(transformValue.substring(0, transformValue.length - 1));
    setFileName(transformValue);
  };

  const { blocks } = usePrayerBlockContext();
  const closeJSONViewer = () => setVisible(false);

  const downloadData = useCallback(() => {
    const blob = new Blob([JSON.stringify(blocks)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = url;
    link.click();

    window.URL.revokeObjectURL(url);
  }, [blocks, filename]);

  return (
    <>
      <div
        id="layout-prayerblockjsonviewer"
        className={visible ? "visible" : ""}
      >
        <div id="layout-prayerblockjsonviewer-controls">
          <button onClick={closeJSONViewer}>
            <X size={20} weight="duotone" />
          </button>
          <TextField
            size="small"
            margin="dense"
            value={filename}
            onChange={handleFileNameChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">.json</InputAdornment>
              ),
            }}
          ></TextField>
          <button onClick={downloadData}>
            <DownloadSimple size={20} weight="duotone" />
          </button>
        </div>
        <JSONTree
          data={blocks}
          hideRoot
          shouldExpandNodeInitially={() => true}
        />
      </div>
      <div
        id="layout-prayerblockjsonviewer-overlay"
        className={visible ? "visible" : ""}
      ></div>
    </>
  );
}
