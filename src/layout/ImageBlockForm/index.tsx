import { db } from "@/database";
import type { PrayerBlock } from "@schema";
import { ChangeEvent, useCallback, useState } from "react";
import DeleteButton from "@/components/DeleteButton";
import { isEmpty, last } from "lodash";
import LoadingIcon from "@/components/LoadingIcon";
import AsyncImage from "@/components/AsyncImage";
import { BlockTypeNames } from "@schema";
import clsx from "clsx";

interface _props {
  prayerBlock: PrayerBlock;
}

export default function ImageBlockForm({ prayerBlock }: _props) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClearImage = useCallback(async () => {
    const _id = prayerBlock?.file?.id;
    if (!_id) return;
    setLoading(true);
    await db.transact([db.tx.$files[_id].delete()]);
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
        db.tx.prayerBlocks[_id].link({ file: uploadedFile.data.id })
      );
      setLoading(false);
    },
    [prayerBlock]
  );

  const isIcon = prayerBlock.blockType?.name === BlockTypeNames.ICON;

  if (loading) {
    return (
      <div className="grid place-items-center bg-white relative rounded-[5px] border border-black/10">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <>
      {isEmpty(prayerBlock?.file?.url) ? (
        <div className="grid place-items-center bg-white relative rounded-[5px] border border-black/10">
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="border-0 outline-none p-3 h-fit [&::file-selector-button]:w-full [&::file-selector-button]:border [&::file-selector-button]:border-[#888] [&::file-selector-button]:rounded-lg [&::file-selector-button]:outline-none [&::file-selector-button]:text-[#555] [&::file-selector-button]:bg-[#ddd] [&::file-selector-button]:px-3 [&::file-selector-button]:grid [&::file-selector-button]:place-items-center [&::file-selector-button:disabled]:opacity-25 [&::file-selector-button:disabled]:cursor-not-allowed"
          />
        </div>
      ) : (
        <div className={clsx("grid place-items-center bg-white relative rounded-[5px] border border-black/10", {
          "[&_img]:w-[84px]": isIcon,
          "[&_img]:max-w-[200px] [&_img]:p-6": !isIcon,
          "[&_button]:absolute [&_button]:top-3 [&_button]:right-3": true
        })}>
          {prayerBlock?.file?.url && (
            <AsyncImage src={prayerBlock?.file?.url} alt="" />
          )}
          <DeleteButton onClick={handleClearImage} icon itemName="image" />
        </div>
      )}
    </>
  );
}
