import { db, TableNames } from "@/database";
import type { PrayerBlock } from "@/database/types";
import { ChangeEvent, useCallback, useState } from "react";
import {
  BlockInputCurrentImageWrapper,
  BlockInputImage,
} from "./StyledComponents";
import DeleteButton from "@/components/DeleteButton";
import { isEmpty, last } from "lodash";
import LoadingIcon from "@/components/LoadingIcon";
import AsyncImage from "@/components/AsyncImage";

const { PRAYERBLOCKS, $FILES } = TableNames;

interface _props {
  prayerBlock: PrayerBlock;
}

export default function ImageBlockForm({ prayerBlock }: _props) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClearImage = useCallback(async () => {
    const _id = prayerBlock?.file?.id;
    if (!_id) return;
    setLoading(true);
    await db.transact([db.tx[$FILES][_id].delete()]);
    setLoading(false);
  }, [prayerBlock]);

  const handleUploadImage = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const _id = prayerBlock.id;
      if (!_id) return;

      setLoading(true);
      const file = event.target.files[0];
      const extension = last(file.name.split("."));
      const path = `${_id}.${extension}`;

      const uploadedFile = await db.storage.uploadFile(path, file);
      await db.transact(
        db.tx[PRAYERBLOCKS][_id].link({ file: uploadedFile.data.id })
      );
      setLoading(false);
    },
    [prayerBlock]
  );

  if (loading) {
    return (
      <BlockInputCurrentImageWrapper blocktype={prayerBlock.blockType?.name}>
        <LoadingIcon />
      </BlockInputCurrentImageWrapper>
    );
  }

  return (
    <>
      {isEmpty(prayerBlock?.file?.url) ? (
        <BlockInputCurrentImageWrapper blocktype={prayerBlock.blockType?.name}>
          <BlockInputImage
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
          />
        </BlockInputCurrentImageWrapper>
      ) : (
        <BlockInputCurrentImageWrapper blocktype={prayerBlock.blockType?.name}>
          {prayerBlock?.file?.url && (
            <AsyncImage src={prayerBlock?.file?.url} alt="" />
          )}
          <DeleteButton onClick={handleClearImage} icon itemName="image" />
        </BlockInputCurrentImageWrapper>
      )}
    </>
  );
}
