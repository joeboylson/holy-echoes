import { PrayerBlock } from "../../database";
import "./index.css";
import "@mdxeditor/editor/style.css";

// import markdownit from "markdown-it";
// const md = markdownit();

export default function PrayerBlockPreview() {
  // TODO
  const prayerBlocks = [] as PrayerBlock[];

  return (
    <div id="layout-prayerblockpreview">
      {prayerBlocks.map((prayerBlock) => {
        return <pre>{JSON.stringify(prayerBlock, undefined, 2)};</pre>;

        // switch (block.type) {
        //   case BlockType.BODY:
        //     return (
        //       <div
        //         className="preview-block preview-body"
        //         dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //       />
        //     );

        //   case BlockType.BODY_CENTERED:
        //     return (
        //       <div
        //         className="preview-block preview-body preview-body-centered"
        //         dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //       />
        //     );

        //   case BlockType.TITLE:
        //     return (
        //       <h1
        //         className="preview-block preview-centered-title"
        //         dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //       />
        //     );

        //   case BlockType.INFO:
        //     return (
        //       <div
        //         className="preview-block preview-info"
        //         dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //       />
        //     );

        //   case BlockType.REFERENCE:
        //     return (
        //       <div
        //         className="preview-block preview-reference"
        //         dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //       />
        //     );

        //   case BlockType.QUOTE:
        //     return (
        //       <div className="preview-quote-wrapper">
        //         <div
        //           className="preview-block preview-quote"
        //           dangerouslySetInnerHTML={{ __html: md.render(block.text) }}
        //         />
        //         <p className="preview-quote-reference">
        //           — {block.extra?.quoteReference}
        //         </p>
        //       </div>
        //     );

        //   case BlockType.IMAGE:
        //     return (
        //       <div className="preview-block preview-image">
        //         <img src={block.extra?.imageUrl} alt="" />
        //       </div>
        //     );

        //   case BlockType.IMAGE_SMALL:
        //     return (
        //       <div className="preview-block preview-image-small">
        //         <img src={block.extra?.imageUrl} alt="" />
        //       </div>
        //     );

        //   case BlockType.LITANY:
        //     return (
        //       <div className="preview-block preview-litany">
        //         {block.extra?.litanyData?.map((i) => {
        //           const {
        //             call: c,
        //             response: r,
        //             superscript: s,
        //             useNewLine: br,
        //           } = i;

        //           if (!c && !r && !s)
        //             return (
        //               <i>
        //                 (empty line) <br />{" "}
        //               </i>
        //             );

        //           return (
        //             <div className="preview-litany-row">
        //               <p>
        //                 {c}
        //                 &nbsp;
        //                 {br && (
        //                   <>
        //                     <br />
        //                     &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
        //                   </>
        //                 )}
        //                 {r && `${r}`}
        //                 {s && <sup>{s}</sup>}
        //               </p>
        //             </div>
        //           );
        //         })}
        //       </div>
        //     );

        //   default:
        //     return <p>(no type selected)</p>;
        // }
      })}
    </div>
  );
}
