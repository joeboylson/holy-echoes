import { db, PrayerBlock, TableNames } from "@/database";
import ImageBlockForm from "@/layout/ImageBlockForm";
import { useState } from "react";

const imageBlockTypeIds = [
  "cbd3d3b8-2772-4e1f-b595-3262c2a30971",
  "09908c76-fb1e-4719-b567-c06d8c4102ce",
  "58d75ee6-3bd7-46be-9bea-7cf462d56d9d",
];

export default function ImageV2() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PrayerBlock[]>([]);
  const [error, setError] = useState<any>();

  const getData = async () => {
    setLoading(true);
    db.queryOnce({
      [TableNames.PRAYERBLOCKS]: {
        blockType: {},
        file: {},
      },
    })
      .then((response) => {
        setData(response.data?.[TableNames.PRAYERBLOCKS] as PrayerBlock[]);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <button onClick={getData}>Run Query</button>
      <p>Loading?: {loading ? "yes" : "no"}</p>
      <p>Error: {JSON.stringify(error)}</p>
      <p>Number of items: {data.length}</p>

      <div style={{ height: "50vh", overflow: "scroll" }}>
        {data.map((i) => {
          if (imageBlockTypeIds.includes(i.blockType?.id ?? "")) {
            return <ImageBlockForm prayerBlock={i} key={i.id} />;
          }
          return <span />;
        })}
      </div>
    </div>
  );
}
