import { PrayerBlock, BlockTypeNames } from "@schema";
import markdownit from "markdown-it";
import LitanyBlock from "./LitanyBlock";
import TwoColumnBlock from "./TwoColumnBlock";
import AsyncImage from "../AsyncImage";

const {
  BODY,
  BODY_CENTERED,
  CENTERED_TITLE,
  IMAGE,
  INFO_TEXT,
  LITANY,
  TWO_COLUMN,
  QUOTE,
  REFERENCE,
  SMALL_IMAGE,
  SPACER,
  ICON,
} = BlockTypeNames;

const md = markdownit({ html: true });

interface _props {
  prayerBlock: PrayerBlock;
}

export default function Block({ prayerBlock }: _props) {
  const blockTypeName = prayerBlock.blockType?.name;
  const text = prayerBlock.text ?? "";
  const src = prayerBlock?.file?.url;
  const reference = prayerBlock.reference ?? "";

  const baseClasses = "min-h-4 text-[#2c2c2c] text-[21px] leading-[27.3px] [&_*]:font-['Neuton',_serif]";
  const spaceAbove = prayerBlock.spaceAbove ? "pt-6" : "";
  const propsNoContent = {
    className: prayerBlock.spaceAbove ? "space-above" : "",
  };

  const htmlProps = {
    dangerouslySetInnerHTML: { __html: md.render(text) },
  };

  if (blockTypeName === BODY)
    return <div className={`${baseClasses} ${spaceAbove}`} {...htmlProps} />;

  if (blockTypeName === BODY_CENTERED)
    return <div className={`${baseClasses} text-center ${spaceAbove}`} {...htmlProps} />;

  if (blockTypeName === CENTERED_TITLE)
    return (
      <h1
        data-id="Centered Title"
        className={`${baseClasses} text-center text-[30px] font-bold leading-[33px] ${spaceAbove}`}
        {...htmlProps}
      />
    );

  if (blockTypeName === INFO_TEXT)
    return <div className={`${baseClasses} text-[16px] leading-[20.8px] text-center ${spaceAbove}`} {...htmlProps} />;

  if (blockTypeName === REFERENCE)
    return <div className={`${baseClasses} text-[16px] leading-[20.8px] text-center italic font-light ${spaceAbove}`} {...htmlProps} />;

  if (blockTypeName === QUOTE) {
    return (
      <div className={`${baseClasses} text-[16px] leading-[20.8px] italic font-light grid [&>:nth-child(2)]:justify-self-end ${spaceAbove}`}>
        <div dangerouslySetInnerHTML={{ __html: md.render(`"${text}"`) }} />
        <p className="preview-quote-reference">— {reference}</p>
      </div>
    );
  }

  if (blockTypeName === IMAGE && src)
    return (
      <div className={`${baseClasses} w-full ${spaceAbove}`}>
        <AsyncImage src={src} alt="" />
      </div>
    );

  if (blockTypeName === SMALL_IMAGE && src)
    return (
      <div className={`${baseClasses} w-[68%] mx-auto ${spaceAbove}`}>
        <AsyncImage src={src} alt="" />
      </div>
    );

  if (blockTypeName === ICON && src)
    return (
      <div className={`${baseClasses} w-9 mx-auto ${spaceAbove}`}>
        <AsyncImage src={src} alt="" />
      </div>
    );

  if (blockTypeName === LITANY)
    return <LitanyBlock prayerBlock={prayerBlock} {...propsNoContent} />;

  if (blockTypeName === TWO_COLUMN)
    return <TwoColumnBlock prayerBlock={prayerBlock} {...propsNoContent} />;

  if (blockTypeName === SPACER)
    return <div style={{ height: `${text}px` }} className={spaceAbove} />;

  return <span />;
}
