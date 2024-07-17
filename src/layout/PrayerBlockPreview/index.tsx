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
            case BlockType.INFO_TEXT:
              return (
                <div
                  style={_style}
                  className="preview-block preview-info-text"
                  dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
                />
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
