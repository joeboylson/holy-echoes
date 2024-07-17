import { MDXEditor } from "@mdxeditor/editor";
import { Block, BlockType, Color } from "../../types";
import { useCallback } from "react";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ArrowFatDown, ArrowFatUp, TrashSimple } from "@phosphor-icons/react";
import { getLocalStorageColors } from "../../utils";

interface _props {
  block: Block;
}

export default function BlockForm({ block }: _props) {
  const { updateBlock, removeBlock, moveBlockUp, moveBlockDown } =
    usePrayerBlockContext();

  const colors = getLocalStorageColors();

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent) => {
      const type = event.target.value as BlockType;
      updateBlock({ ...block, type });
    },
    [block, updateBlock]
  );

  const handleBodyChange = useCallback(
    (text: string) => {
      updateBlock({ ...block, text });
    },
    [block, updateBlock]
  );

  const handleColorChange = useCallback(
    (color: Color) => {
      updateBlock({ ...block, color });
    },
    [block, updateBlock]
  );

  const handleRemoveBlock = () => removeBlock(block);
  const handleMoveBlockUp = () => moveBlockUp(block);
  const handleMoveBlockDown = () => moveBlockDown(block);

  return (
    <div className="layout-blockform">
      <div className="layout-blockform-content">
        {/**
         * COLOR
         */}
        <div className="layout-block-colorpicker-wrapper">
          {colors?.map((color) => {
            const _selected = block.color === color;
            return (
              <button
                style={{ backgroundColor: color }}
                className={`layout-colorscontrols-color ${
                  _selected ? "selected" : ""
                }`}
                onClick={() => handleColorChange(color)}
              ></button>
            );
          })}
        </div>

        {/**
         * TYPE
         */}
        <Select value={block.type} onChange={handleTypeChange} size="small">
          {Object.values(BlockType).map((blockType) => (
            <MenuItem value={blockType}>{blockType}</MenuItem>
          ))}
        </Select>

        {/**
         * INPUT
         */}
        {block.type === BlockType.TITLE && (
          <>
            <p>Title:</p>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </>
        )}

        {block.type === BlockType.BODY && (
          <>
            <p>Body Copy:</p>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </>
        )}

        {block.type === BlockType.INFO_TEXT && (
          <>
            <i>
              This block can be used to add prayer information before or after
              the prayer
            </i>
            <div className="editor-wrapper">
              <MDXEditor markdown={block.text} onChange={handleBodyChange} />
            </div>
          </>
        )}
      </div>

      <div className="layout-blockform-controls">
        <button onClick={handleMoveBlockUp}>
          <ArrowFatUp size={20} weight="duotone" />
        </button>
        <button onClick={handleMoveBlockDown}>
          <ArrowFatDown size={20} weight="duotone" />
        </button>
        <button onClick={handleRemoveBlock}>
          <TrashSimple size={20} color="#e20303" weight="duotone" />
        </button>
      </div>
    </div>
  );
}
