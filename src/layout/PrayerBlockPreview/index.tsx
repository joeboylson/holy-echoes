import "./index.css";
import "@mdxeditor/editor/style.css";
import { usePrayerBlockContext } from "../../context/prayerBlocks";
import { BlockType } from "../../types";
import markdownit from "markdown-it";

const md = markdownit();

export default function PrayerBlockPreview() {
  const { blocks } = usePrayerBlockContext();

  return (
    <div id="layout-prayerblockpreview">
      {blocks &&
        blocks.map((block) => {
          const _style = {
            color: block.color,
          };

          switch (block.type) {
            /**
             *
             */
            case BlockType.BODY:
              return (
                <div
                  style={_style}
                  className="preview-block preview-body"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
              );

            case BlockType.BODY_CENTERED:
              return (
                <div
                  style={_style}
                  className="preview-block preview-body preview-body-centered"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
              );

            /**
             *
             */
            case BlockType.TITLE:
              return (
                <h1
                  style={_style}
                  className="preview-block preview-centered-title"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
              );

            /**
             *
             */
            case BlockType.INFO:
              return (
                <div
                  style={_style}
                  className="preview-block preview-info"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
              );

            /**
             *
             */
            case BlockType.REFERENCE:
              return (
                <div
                  style={_style}
                  className="preview-block preview-reference"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
              );

            /**
             *
             */
            case BlockType.QUOTE:
              return (
                <div className="preview-quote-wrapper">
                  <div
                    style={_style}
                    className="preview-block preview-quote"
                    dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                  />
                  <p className="preview-quote-reference">
                    — {block.extra?.quoteReference}
                  </p>
                </div>
              );

            /**
             *
             */
            case BlockType.IMAGE:
              return (
                <div className="preview-block preview-image">
                  <img src={block.extra?.imageUrl} alt="" />
                </div>
              );

            /**
             *
             */
            case BlockType.IMAGE_SMALL:
              return (
                <div className="preview-block preview-image-small">
                  <img src={block.extra?.imageUrl} alt="" />
                </div>
              );

            /**
             *
             */
            case BlockType.LITANY:
              return (
                <div className="preview-block preview-litany">
                  {block.extra?.litanyData?.map((i) => {
                    const {
                      call: c,
                      response: r,
                      superscript: s,
                      useNewLine: br,
                    } = i;

                    if (!c && !r && !s)
                      return (
                        <i>
                          (empty line) <br />{" "}
                        </i>
                      );

                    return (
                      <div className="preview-litany-row">
                        <p>
                          {c}
                          &nbsp;
                          {br && (
                            <>
                              <br />
                              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                            </>
                          )}
                          {r && `${r}`}
                          {s && <sup>{s}</sup>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );

            /**
             *
             */
            default:
              return <p>(no type selected)</p>;
          }
        })}
    </div>
  );
}
