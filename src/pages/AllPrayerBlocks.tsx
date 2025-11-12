import AdminAccessWrapper from "../layout/AdminAccessWrapper";
import { useWindowSize } from "@uidotdev/usehooks";
import WindowTooSmall from "../components/WindowTooSmall";
import { HEADER_HEIGHT } from "@/constants/layout";
import { useState, useMemo, useCallback } from "react";
import { db } from "@/database";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cascadeDeletePrayerBlock } from "@/utils/prayerBlock";
import type { PrayerBlock } from "@schema";
import { BlockTypeNames } from "@schema";
import DeleteButton from "@/components/DeleteButton";

export default function AllPrayerBlocks() {
  const [selectedBlockTypeId, setSelectedBlockTypeId] = useState<
    string | "all"
  >("all");

  const { data, isLoading } = db.useQuery({
    prayerBlocks: {
      blockType: {},
      prayer: {},
      litanyBlocks: {},
      file: {},
      $: {
        order: {
          order: "desc",
        },
      },
    },
    blockTypes: {
      $: {
        order: {
          order: "asc",
        },
      },
    },
  });

  const handleDeleteBlock = useCallback(async (block: PrayerBlock) => {
    if (!block.id) return;

    // Cascade delete litany blocks first
    cascadeDeletePrayerBlock(block);

    // Delete the prayer block itself
    await db.transact([db.tx.prayerBlocks[block.id].delete()]);
  }, []);

  const filteredBlocks = useMemo(() => {
    if (!data?.prayerBlocks) return [];
    if (selectedBlockTypeId === "all") return data.prayerBlocks;
    return data.prayerBlocks.filter(
      (block) => block.blockType?.id === selectedBlockTypeId
    );
  }, [data?.prayerBlocks, selectedBlockTypeId]);

  const size = useWindowSize();
  if ((size.width ?? 0) < 1200) return <WindowTooSmall />;

  if (isLoading) {
    return (
      <AdminAccessWrapper>
        <div className="p-6 w-screen grid gap-6 overflow-hidden" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
          <p>Loading...</p>
        </div>
      </AdminAccessWrapper>
    );
  }

  return (
    <AdminAccessWrapper data-id="AdminAccessWrapper">
      <div className="p-6 w-screen grid gap-6 overflow-hidden" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }} data-id="StyledAllPrayerBlocks">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            All Prayer Blocks
          </h1>

          <div className="flex items-center gap-4">
            <label className="font-medium">Filter by Block Type:</label>
            <Select
              value={selectedBlockTypeId}
              onValueChange={setSelectedBlockTypeId}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select block type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Block Types</SelectItem>
                {data?.blockTypes?.map((blockType) => (
                  <SelectItem key={blockType.id} value={blockType.id ?? ""}>
                    {blockType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              ({filteredBlocks.length} blocks)
            </span>
          </div>
        </div>

        <div className="grid gap-3 overflow-y-auto content-start pb-12" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px - 100px)` }}>
          {filteredBlocks.map((block) => {
            const blockTypeName = block.blockType?.name as BlockTypeNames;
            const isImageBlock = [
              BlockTypeNames.IMAGE,
              BlockTypeNames.SMALL_IMAGE,
              BlockTypeNames.ICON,
            ].includes(blockTypeName);
            const isIcon = blockTypeName === BlockTypeNames.ICON;

            return (
              <div key={block.id} className="p-4 border border-gray-300 rounded-lg bg-white grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <h3 className="m-0 mb-2 font-semibold text-[var(--blue-10)]">{block.blockType?.name ?? "No Block Type"}</h3>
                  <p className="my-1 text-sm text-gray-600">
                    <strong>Prayer:</strong> {block.prayer?.name ?? "Unknown"}
                  </p>
                  <p className="my-1 text-sm text-gray-600">
                    <strong>Order:</strong> {block.order}
                  </p>
                  {isImageBlock && block.file?.url && (
                    <img
                      src={block.file.url}
                      alt="Block image"
                      className="mt-2 rounded border border-gray-300"
                      style={{
                        maxWidth: isIcon ? "50px" : "200px",
                        maxHeight: isIcon ? "50px" : "200px"
                      }}
                    />
                  )}
                  {block.text && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs max-h-[100px] overflow-y-auto">
                      <strong>Text:</strong>
                      <div>{block.text}</div>
                    </div>
                  )}
                  {block.reference && (
                    <p className="my-1 text-sm text-gray-600">
                      <strong>Reference:</strong> {block.reference}
                    </p>
                  )}
                </div>
                <DeleteButton
                  onClick={() => handleDeleteBlock(block)}
                  itemName="Block"
                />
              </div>
            );
          })}
        </div>
      </div>
    </AdminAccessWrapper>
  );
}
