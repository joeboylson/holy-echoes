import { PrayerBlock } from "../database";

export type ProviderValue = {
  blocks?: PrayerBlock[];
  addBlock: () => void;
  updateBlock: (_updatedBlock: PrayerBlock) => void;
  removeBlock: (_blockToRemove: PrayerBlock) => void;
  moveBlockUp: (_block: PrayerBlock) => void;
  moveBlockDown: (_block: PrayerBlock) => void;
};
