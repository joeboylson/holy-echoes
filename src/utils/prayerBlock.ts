import { Block, BlockType } from "../types";

export const blankRow = [{ value: "call" }, { value: "response" }];

export function generateNewBlock() {
  const _block: Block = {
    id: new Date().valueOf(),
    text: "",
    type: BlockType.BODY,
    color: "#000000",
  };

  return _block;
}
