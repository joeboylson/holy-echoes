import { first, orderBy } from "lodash";
import {
  BlockTypes,
  db,
  Prayer,
  PrayerBlock,
  TableNames,
} from "../../database";
import "./index.css";
import "@mdxeditor/editor/style.css";
import { useParams } from "react-router-dom";
import markdownit from "markdown-it";

const { PRAYERBLOCKS, PRAYERS } = TableNames;
const {
  BODY,
  BODY_CENTERED,
  CENTERED_TITLE,
  IMAGE,
  INFO_TEXT,
  LITANY,
  QUOTE,
  REFERENCE,
  SMALL_IMAGE,
} = BlockTypes;

const md = markdownit({ html: true });

export default function PrayerBlockPreview() {
  const { prayerId } = useParams();

  const { data, isLoading } = db.useQuery(
    prayerId
      ? {
          [PRAYERS]: {
            [PRAYERBLOCKS]: { blockType: {}, litanyBlocks: {} },
            $: { where: { id: prayerId } },
          },
        }
      : null
  );

  const prayers = (data?.[PRAYERS] ?? []) as Prayer[];
  const prayerBlocks = first(prayers)?.prayerBlocks as PrayerBlock[];

  return (
    <div id="layout-prayerblockpreview">
      {!isLoading &&
        prayerBlocks.map((prayerBlock) => {
          const blockTypeName = prayerBlock.blockType?.name;
          const imageUrl = prayerBlock.imageUrl;
          const text = prayerBlock.text ?? "";
          const reference = prayerBlock.reference ?? "";

          switch (blockTypeName) {
            case BODY:
              return (
                <div
                  key={prayerBlock.id}
                  className="preview-block preview-body"
                  dangerouslySetInnerHTML={{ __html: md.render(text) }}
                />
              );

            case BODY_CENTERED:
              return (
                <div
                  key={prayerBlock.id}
                  className="preview-block preview-body preview-body-centered"
                  dangerouslySetInnerHTML={{ __html: md.render(text) }}
                />
              );

            case CENTERED_TITLE:
              return (
                <h1
                  key={prayerBlock.id}
                  className="preview-block preview-centered-title"
                  dangerouslySetInnerHTML={{ __html: md.render(text) }}
                />
              );

            case INFO_TEXT:
              return (
                <div
                  key={prayerBlock.id}
                  className="preview-block preview-info"
                  dangerouslySetInnerHTML={{ __html: md.render(text) }}
                />
              );

            case REFERENCE:
              return (
                <div
                  key={prayerBlock.id}
                  className="preview-block preview-reference"
                  dangerouslySetInnerHTML={{ __html: md.render(text) }}
                />
              );

            case QUOTE:
              return (
                <div className="preview-quote-wrapper" key={prayerBlock.id}>
                  <div
                    className="preview-block preview-quote"
                    dangerouslySetInnerHTML={{ __html: md.render(`"${text}"`) }}
                  />
                  <p className="preview-quote-reference">— {reference}</p>
                </div>
              );

            case IMAGE:
              return (
                <div
                  className="preview-block preview-image"
                  key={prayerBlock.id}
                >
                  <img src={imageUrl} alt="" />
                </div>
              );

            case SMALL_IMAGE:
              return (
                <div
                  className="preview-block preview-image-small"
                  key={prayerBlock.id}
                >
                  <img src={imageUrl} alt="" />
                </div>
              );

            case LITANY:
              const orderedLitanyBlocks = orderBy(
                prayerBlock?.litanyBlocks,
                "order"
              );

              return (
                <div
                  className="preview-block preview-litany"
                  key={prayerBlock.id}
                >
                  {orderedLitanyBlocks.map((i) => {
                    const { call, response, superscript, inline } = i;

                    if (!call && !response && !superscript)
                      return (
                        <i>
                          (empty line)
                          <br />
                        </i>
                      );

                    return (
                      <div className="preview-litany-row">
                        <p>
                          {call}
                          &nbsp;
                          {!inline && (
                            <>
                              <br />
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            </>
                          )}
                          {response && `${response}`}
                          {superscript && <sup>&nbsp;{superscript}</sup>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );

            default:
              return <p>(no type selected)</p>;
          }
        })}
    </div>
  );
}
