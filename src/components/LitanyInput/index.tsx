import "./index.css";
import { useCallback, useEffect, useState } from "react";
import { LitanyRow } from "../../types/litany";
import { Checkbox, TextField } from "@mui/material";
import {
  ArrowElbowDownLeft,
  ArrowFatDown,
  ArrowFatUp,
  RowsPlusBottom,
  TextSuperscript,
  TrashSimple,
  UserSound,
  UsersFour,
} from "@phosphor-icons/react";
import { indexOf } from "lodash";

interface _props {
  data?: LitanyRow[];
  onChange: (data: LitanyRow[]) => void;
}

export default function LitanyInput({ data, onChange }: _props) {
  const [rows, setRows] = useState<LitanyRow[]>();

  useEffect(() => {
    if (rows === undefined) setRows(data);
  }, [data, rows]);

  const handleOnChange = useCallback(
    (_data: LitanyRow[]) => {
      setRows(_data);
      onChange(_data);
    },
    [onChange]
  );

  const handleAddNewRow = useCallback(() => {
    const newRow: LitanyRow = { id: new Date().valueOf() };
    const newData: LitanyRow[] = [...(data ?? []), newRow];
    handleOnChange(newData);
  }, [handleOnChange, data]);

  const handleUpdateRow = useCallback(
    (_row: LitanyRow) => {
      if (!data) return;
      const newData = data?.map((i) => (i.id === _row.id ? _row : i));
      handleOnChange(newData);
    },
    [handleOnChange, data]
  );

  const handleMoveRowUp = useCallback(
    (_row: LitanyRow) => {
      if (!data) return;
      const rowIndex = indexOf(data, _row);
      if (rowIndex === 0) return data;
      const reorderedRows = data.filter((i) => i.id !== _row.id);
      if (!reorderedRows) return data;
      reorderedRows.splice(rowIndex - 1, 0, _row);
      handleOnChange(reorderedRows);
    },
    [data, handleOnChange]
  );

  const handleMoveRowDown = useCallback(
    (_row: LitanyRow) => {
      if (!data) return;
      const rowIndex = indexOf(data, _row);
      if (rowIndex === data?.length - 1) return rowIndex;
      const reorderedRows = data.filter((i) => i.id !== _row.id);
      if (!reorderedRows) return data;
      reorderedRows.splice(rowIndex + 1, 0, _row);
      handleOnChange(reorderedRows);
    },
    [data, handleOnChange]
  );

  const handleRemoveRow = useCallback(
    (_row: LitanyRow) => {
      if (!data) return;
      const filteredRows = data.filter((i) => i.id !== _row.id);
      if (!filteredRows) return;
      handleOnChange(filteredRows);
    },
    [data, handleOnChange]
  );

  return (
    <div className="components-litanyinput">
      <div className="components-litanyinput-row">
        <UserSound size={20} weight="duotone" />
        <UsersFour size={20} weight="duotone" />
        <TextSuperscript size={20} weight="duotone" />
        <ArrowElbowDownLeft size={20} weight="duotone" />
      </div>

      {rows?.map((i) => {
        const updateRowCall = (call: string) => {
          const _row: LitanyRow = { ...i, call };
          handleUpdateRow(_row);
        };

        const updateRowResponse = (response: string) => {
          const _row: LitanyRow = { ...i, response };
          handleUpdateRow(_row);
        };

        const updateRowSuperscript = (superscript: string) => {
          const _row: LitanyRow = { ...i, superscript };
          handleUpdateRow(_row);
        };

        const updateRowUsesNewLine = (useNewLine: boolean) => {
          const _row: LitanyRow = { ...i, useNewLine };
          handleUpdateRow(_row);
        };

        const moveRowUp = () => handleMoveRowUp(i);
        const moveRowDown = () => handleMoveRowDown(i);
        const removeRow = () => handleRemoveRow(i);

        return (
          <div className="components-litanyinput-row" key={i.id}>
            {/* Call */}
            <TextField
              size="small"
              onChange={(e) => updateRowCall(e.target.value)}
              defaultValue={i.call}
              variant="standard"
              multiline
            />

            {/* Response */}
            <TextField
              size="small"
              onChange={(e) => updateRowResponse(e.target.value)}
              defaultValue={i.response}
              variant="standard"
              multiline
            />

            {/* Superscript */}
            <TextField
              size="small"
              onChange={(e) => updateRowSuperscript(e.target.value)}
              defaultValue={i.superscript}
              variant="standard"
              multiline
            />

            <div>
              <Checkbox
                onChange={(e) => updateRowUsesNewLine(e.target.checked)}
                checked={i.useNewLine}
              />
            </div>

            <button onClick={moveRowUp}>
              <ArrowFatUp size={20} weight="duotone" />
            </button>
            <button onClick={moveRowDown}>
              <ArrowFatDown size={20} weight="duotone" />
            </button>
            <button onClick={removeRow}>
              <TrashSimple size={20} color="#e20303" weight="duotone" />
            </button>
          </div>
        );
      })}

      <button onClick={handleAddNewRow}>
        <RowsPlusBottom size={20} color="#000000" weight="duotone" />
      </button>
    </div>
  );
}
