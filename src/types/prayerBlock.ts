import { Color } from "./color";

export enum BlockType {
  TITLE = "Centered Title",
  BODY = "Body",
  INFO_TEXT = "Info Text",
}

export type Block = {
  id: number;
  type: BlockType;
  text: string;
  color?: Color;
};

export type ProviderValue = {
  blocks?: Block[];
  colors?: Color[];
  addBlock: () => void;
  clearBlocks: () => void;
  updateBlock: (_updatedBlock: Block) => void;
  removeBlock: (_blockToRemove: Block) => void;
  moveBlockUp: (_block: Block) => void;
  moveBlockDown: (_block: Block) => void;
  setColors: (_colors: Color[]) => void;
};
