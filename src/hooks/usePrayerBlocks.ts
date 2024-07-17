import { useCallback, useEffect, useState } from "react";
import { Block, Color, ProviderValue } from "../types";
import {
  generateNewBlock,
  getLocalStorageBlocks,
  getLocalStorageColors,
  setLocalStorageBlocks,
} from "../utils";
import { debounce, indexOf, isEmpty } from "lodash";

export const prayerBlockContextDefaultValue: ProviderValue = {
  blocks: [],
  colors: [],
  addBlock: () => {},
  clearBlocks: () => {},
  updateBlock: (_updatedBlock: Block) => {},
  removeBlock: (_blockToRemove: Block) => {},
  moveBlockUp: (_block: Block) => {},
  moveBlockDown: (_block: Block) => {},
  setColors: (_colors: Color[]) => {},
};

export function usePrayerBlocks() {
  const [blocks, setBlocks] = useState<Block[] | undefined>();
  const [colors, setColors] = useState<Color[] | undefined>();

  useEffect(() => {
    /**
     * If no blocks exist, check and see if there are any to load in from
     * localstorage
     */
    if (!blocks) {
      const _blocks = getLocalStorageBlocks();
      setBlocks(_blocks);
    }

    /**
     * If blocks _DO_ exist, save them to localstorage
     */
    if (blocks) setLocalStorageBlocks(blocks);
  }, [blocks]);

  useEffect(() => {
    /**
     * If no colors exist, check and see if there are any to load in from
     * localstorage
     */
    if (!colors) {
      const _colors = getLocalStorageColors() ?? [];
      setColors(_colors);
    }
  }, [colors]);

  const addBlock = useCallback(() => {
    setBlocks((_blocks) => {
      if (_blocks) return [..._blocks, generateNewBlock()];
      return [generateNewBlock()];
    });
  }, []);

  const removeBlock = useCallback((blockToRemove: Block) => {
    setBlocks((_blocks) => {
      if (!_blocks) return;
      const _filteredBlocks = _blocks.filter(
        (_block) => _block.id !== blockToRemove.id
      );
      if (isEmpty(_filteredBlocks)) return [generateNewBlock()];
      return _filteredBlocks;
    });
  }, []);

  const updateBlock = debounce((updatedBlock: Block) => {
    if (!blocks) return;
    setBlocks((_blocks) => {
      if (!_blocks) return [generateNewBlock()];
      return _blocks.map((_block) =>
        _block.id === updatedBlock.id ? updatedBlock : _block
      );
    });
  }, 250);

  const moveBlockUp = useCallback((_block: Block) => {
    setBlocks((_blocks) => {
      if (!_blocks) return [];

      const blockIndex = indexOf(_blocks, _block);
      if (blockIndex === 0) return _blocks;

      const reorderedBlocks = _blocks.filter((i) => i.id !== _block.id);

      if (!reorderedBlocks) return _blocks;
      reorderedBlocks.splice(blockIndex - 1, 0, _block);
      return reorderedBlocks;
    });
  }, []);

  const moveBlockDown = useCallback((_block: Block) => {
    setBlocks((_blocks) => {
      if (!_blocks) return [];

      const blockIndex = indexOf(_blocks, _block);
      if (blockIndex === _blocks.length - 1) return _blocks;

      const reorderedBlocks = _blocks?.filter((i) => i.id !== _block.id);

      if (!reorderedBlocks) return _blocks;
      reorderedBlocks.splice(blockIndex + 1, 0, _block);
      return reorderedBlocks;
    });
  }, []);

  const clearBlocks = () => setBlocks([generateNewBlock()]);

  const returnValue: ProviderValue = {
    blocks: blocks,
    colors: colors,
    addBlock,
    clearBlocks,
    updateBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    setColors,
  };
  return returnValue;
}
