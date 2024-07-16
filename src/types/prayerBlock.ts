export enum BlockType {
  TITLE = "1. Centered Title",
  BODY = "2. Body",
  INFO_TEXT = "3. Info Text",
}

export type Block = {
  id: number;
  type: BlockType;
  text: string;
};

export type ProviderValue = {
  blocks?: Block[];
  addBlock: () => void;
  clearBlocks: () => void;
  updateBlock: (_updatedBlock: Block) => void;
  removeBlock: (_blockToRemove: Block) => void;
  moveBlockUp: (_block: Block) => void;
  moveBlockDown: (_block: Block) => void;
};
