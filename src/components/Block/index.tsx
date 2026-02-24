import { PrayerBlock, BlockTypeNames } from "@schema";
import markdownit from "markdown-it";
import clsx from "clsx";
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

const baseClasses =
  "min-h-[16px] text-[#2c2c2c] font-['Neuton',_serif] ![&_*]:font-['Neuton',_serif] text-[21px] leading-[calc(21px*1.3)]";
const smallTextClasses = "!text-[16px] !leading-[calc(16px*1.3)]";

interface _props {
  prayerBlock: PrayerBlock;
}

export default function Block({ prayerBlock }: _props) {
  const blockTypeName = prayerBlock.blockType?.name;
  const text = prayerBlock.text ?? "";
  const src = prayerBlock?.file?.url;
  const reference = prayerBlock.reference ?? "";

  const spaceAbove = prayerBlock.spaceAbove;
  const ptSpaceAbove = { "pt-6": spaceAbove };
  const renderedText = (
    <div dangerouslySetInnerHTML={{ __html: md.render(text) }} />
  );

  if (blockTypeName === BODY) {
    return (
      <div className={clsx(baseClasses, ptSpaceAbove)}>{renderedText}</div>
    );
  }

  if (blockTypeName === BODY_CENTERED) {
    return (
      <div className={clsx(baseClasses, "text-center", ptSpaceAbove)}>
        {renderedText}
      </div>
    );
  }

  if (blockTypeName === CENTERED_TITLE) {
    const className = clsx(
      baseClasses,
      "text-center text-[30px] font-bold leading-[calc(30px*1.1)]",
      { "!pt-6": spaceAbove },
    );
    return (
      <h1 data-id="Centered Title" className={className}>
        {renderedText}
      </h1>
    );
  }

  if (blockTypeName === INFO_TEXT) {
    return (
      <div
        className={clsx(
          baseClasses,
          smallTextClasses,
          "text-center",
          ptSpaceAbove,
        )}
      >
        {renderedText}
      </div>
    );
  }

  if (blockTypeName === REFERENCE) {
    return (
      <div
        className={clsx(
          baseClasses,
          smallTextClasses,
          "text-center italic font-[100]",
          ptSpaceAbove,
        )}
      >
        {renderedText}
      </div>
    );
  }

  if (blockTypeName === QUOTE) {
    return (
      <div
        className={clsx(
          baseClasses,
          smallTextClasses,
          "italic font-[100] grid [&>:nth-child(2)]:justify-self-end",
          ptSpaceAbove,
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: md.render(`"${text}"`) }} />
        <p className="preview-quote-reference">— {reference}</p>
      </div>
    );
  }

  if (blockTypeName === IMAGE && src) {
    return (
      <div className={clsx(baseClasses, "w-full", ptSpaceAbove)}>
        <AsyncImage src={src} alt="" />
      </div>
    );
  }

  if (blockTypeName === SMALL_IMAGE && src) {
    return (
      <div className={clsx(baseClasses, "w-[68%] mx-auto", ptSpaceAbove)}>
        <AsyncImage src={src} alt="" />
      </div>
    );
  }

  if (blockTypeName === ICON && src) {
    return (
      <div className={clsx(baseClasses, "w-9 mx-auto", ptSpaceAbove)}>
        <AsyncImage src={src} alt="" />
      </div>
    );
  }

  if (blockTypeName === LITANY) {
    const className = spaceAbove ? "space-above" : "";
    return <LitanyBlock prayerBlock={prayerBlock} className={className} />;
  }

  if (blockTypeName === TWO_COLUMN) {
    const className = spaceAbove ? "space-above" : "";
    return <TwoColumnBlock prayerBlock={prayerBlock} className={className} />;
  }

  if (blockTypeName === SPACER) {
    const className = clsx({ "pt-6": spaceAbove });
    return <div style={{ height: `${text}px` }} className={className} />;
  }

  return <span />;
}
