import { db, PrayerBlock, TableNames } from "@/database";
import { ChangeEvent, useCallback } from "react";
import {
  BlockInputCurrentImageWrapper,
  BlockInputImage,
} from "./StyledComponents";

const { PRAYERBLOCKS, $FILES } = TableNames;

interface _props {
  prayerBlock: PrayerBlock;
}

export default function ImageBlockForm({ prayerBlock }: _props) {
  const handleClearImage_V2 = useCallback(() => {
    const _id = prayerBlock?.file?.id;
    if (!_id) return;
    db.transact([db.tx[$FILES][_id].delete()]);
  }, [prayerBlock]);

  const handleUploadImage = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const _id = prayerBlock.id;
      if (!_id) return;

      const file = event.target.files[0];

      // TODO: add loading
      // TODO: fix filename
      const path = `${_id}/image.png`;

      const uploadedFile = await db.storage.uploadFile(path, file);
      await db.transact(
        db.tx[PRAYERBLOCKS][_id].link({ file: uploadedFile.data.id })
      );
    },
    [prayerBlock]
  );

  return (
    <div>
      <BlockInputCurrentImageWrapper blocktype={prayerBlock.blockType?.name}>
        <img src={prayerBlock?.file?.url} alt="" />
        <button onClick={handleClearImage_V2}>Clear Image</button>
      </BlockInputCurrentImageWrapper>
      <BlockInputImage
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
      />
    </div>
  );
}
