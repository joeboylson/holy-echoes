/* eslint-disable react-refresh/only-export-components */

import styled from "styled-components";
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
import { TrashSimple } from "@phosphor-icons/react";
import { cascadeDeletePrayerBlock } from "@/utils/prayerBlock";
import type { PrayerBlock } from "@schema";
import { BlockTypeNames } from "@schema";

const StyledAllPrayerBlocks = styled.div`
  padding: 24px;
  width: 100vw;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  display: grid;
  gap: 24px;
  overflow: hidden;
`;

const BlocksList = styled.div`
  display: grid;
  gap: 12px;
  overflow-y: auto;
  height: calc(100vh - ${HEADER_HEIGHT}px - 100px);
  align-content: start;
  padding-bottom: 48px;
`;

const BlockItem = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;

  h3 {
    margin: 0 0 8px 0;
    font-weight: 600;
    color: var(--blue-10);
  }

  p {
    margin: 4px 0;
    font-size: 14px;
    color: #666;
  }

  .block-text {
    margin-top: 8px;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 13px;
    max-height: 100px;
    overflow-y: auto;
  }
`;

const DeleteButton = styled.button`
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  height: fit-content;

  &:hover {
    opacity: 0.7;
  }
`;

const BlockImage = styled.img<{ $isIcon?: boolean }>`
  margin-top: 8px;
  max-width: ${(props) => (props.$isIcon ? "50px" : "200px")};
  max-height: ${(props) => (props.$isIcon ? "50px" : "200px")};
  border-radius: 4px;
  border: 1px solid #ddd;
`;

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
        <StyledAllPrayerBlocks>
          <p>Loading...</p>
        </StyledAllPrayerBlocks>
      </AdminAccessWrapper>
    );
  }

  return (
    <AdminAccessWrapper data-id="AdminAccessWrapper">
      <StyledAllPrayerBlocks data-id="StyledAllPrayerBlocks">
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

        <BlocksList>
          {filteredBlocks.map((block) => {
            const blockTypeName = block.blockType?.name as BlockTypeNames;
            const isImageBlock = [
              BlockTypeNames.IMAGE,
              BlockTypeNames.SMALL_IMAGE,
              BlockTypeNames.ICON,
            ].includes(blockTypeName);
            const isIcon = blockTypeName === BlockTypeNames.ICON;

            return (
              <BlockItem key={block.id}>
                <div>
                  <h3>{block.blockType?.name ?? "No Block Type"}</h3>
                  <p>
                    <strong>Prayer:</strong> {block.prayer?.name ?? "Unknown"}
                  </p>
                  <p>
                    <strong>Order:</strong> {block.order}
                  </p>
                  {isImageBlock && block.file?.url && (
                    <BlockImage
                      src={block.file.url}
                      alt="Block image"
                      $isIcon={isIcon}
                    />
                  )}
                  {block.text && (
                    <div className="block-text">
                      <strong>Text:</strong>
                      <div>{block.text}</div>
                    </div>
                  )}
                  {block.reference && (
                    <p>
                      <strong>Reference:</strong> {block.reference}
                    </p>
                  )}
                </div>
                <DeleteButton onClick={() => handleDeleteBlock(block)}>
                  <TrashSimple
                    size={20}
                    weight="duotone"
                    color="var(--red-10)"
                  />
                </DeleteButton>
              </BlockItem>
            );
          })}
        </BlocksList>
      </StyledAllPrayerBlocks>
    </AdminAccessWrapper>
  );
}
