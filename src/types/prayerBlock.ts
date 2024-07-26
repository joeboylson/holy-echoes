import { Color } from "./color";
import { LitanyRow } from "./litany";

export enum BlockType {
  TITLE = "Centered Title",
  BODY = "Body",
  BODY_CENTERED = "Body Centered",
  INFO = "Info Text",
  REFERENCE = "Reference",
  QUOTE = "Quote",
  IMAGE = "Image",
  IMAGE_SMALL = "Small Image",
  LITANY = "Litany",
}

export type BlockExtra = {
  quoteReference?: string;
  imageUrl?: string;
  litanyData?: LitanyRow[];
};

export type Block = {
  id: number;
  type: BlockType;
  text: string;
  color?: Color;
  extra?: BlockExtra;
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
