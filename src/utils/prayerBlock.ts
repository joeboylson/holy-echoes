import { Block, BlockType } from "../types";

export const LOCALSTORAGE_BLOCKS_KEY = "prayer-formatter-blocks";

// shorthand
const _KEY = LOCALSTORAGE_BLOCKS_KEY;

export function getLocalStorageBlocks() {
  const localStorageBlocksString = localStorage.getItem(_KEY);
  if (localStorageBlocksString) {
    try {
      const localStorageBlocks = JSON.parse(localStorageBlocksString);
      return localStorageBlocks ?? [generateNewBlock()];
    } catch (error) {
      console.error(error);
      // TODO: throw an error here?

      /**
       * SyntaxError would be from JSON.parse(...); this would mean that the
       * saved localstorage value is invalid and should be cleared out
       */
      if (error instanceof SyntaxError) {
        setLocalStorageBlocks([]);
        return [];
      }
    }
  }
}

export function setLocalStorageBlocks(blocks: Block[]) {
  try {
    const _data = JSON.stringify(blocks);
    localStorage.setItem(_KEY, _data);
  } catch (error) {
    /**
     * SyntaxError would be from JSON.parse(...); this would mean that the
     * saved localstorage value is invalid and should be cleared out
     */
    if (error instanceof SyntaxError) {
      // TODO: throw an error here?
    }

    // TODO: throw an error here?
    console.error(error);
  }
}

export function generateNewBlock() {
  const _block: Block = {
    id: new Date().valueOf(),
    text: "",
    type: BlockType.BODY,
    color: "#000000",
  };

  return _block;
}
