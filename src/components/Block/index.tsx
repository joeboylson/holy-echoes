import { BlockTypes, PrayerBlock } from "../../database";
import markdownit from "markdown-it";
import LitanyBlock from "./LitanyBlock";
import {
  BlockImage,
  BlockImageIcon,
  BlockImageSmall,
  BlockSpacer,
  Body,
  BodyCentered,
  CenteredTitle,
  InfoText,
  Quote,
  Reference,
} from "./StyledComponents";
import TwoColumnBlock from "./TwoColumnBlock";

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
} = BlockTypes;

const md = markdownit({ html: true });

interface _props {
  prayerBlock: PrayerBlock;
}

export default function Block({ prayerBlock }: _props) {
  const blockTypeName = prayerBlock.blockType?.name;
  const text = prayerBlock.text ?? "";
  const imageUrl = prayerBlock.imageUrl;
  const reference = prayerBlock.reference ?? "";

  const propsNoContent = {
    className: prayerBlock.spaceAbove ? "space-above" : "",
  };

  const props = {
    ...propsNoContent,
    dangerouslySetInnerHTML: { __html: md.render(text) },
  };

  if (blockTypeName === BODY) return <Body {...props} />;
  if (blockTypeName === BODY_CENTERED) return <BodyCentered {...props} />;
  if (blockTypeName === CENTERED_TITLE)
    return <CenteredTitle data-id="Centered Title" {...props} />;
  if (blockTypeName === INFO_TEXT) return <InfoText {...props} />;
  if (blockTypeName === REFERENCE) return <Reference {...props} />;
  if (blockTypeName === QUOTE) {
    return (
      <Quote>
        <div
          {...props}
          dangerouslySetInnerHTML={{ __html: md.render(`"${text}"`) }}
        />
        <p className="preview-quote-reference">— {reference}</p>
      </Quote>
    );
  }

  if (blockTypeName === IMAGE)
    return <BlockImage src={imageUrl} alt="" {...propsNoContent} />;

  if (blockTypeName === SMALL_IMAGE)
    return <BlockImageSmall src={imageUrl} alt="" {...propsNoContent} />;

  if (blockTypeName === ICON)
    return <BlockImageIcon src={imageUrl} alt="" {...propsNoContent} />;

  if (blockTypeName === LITANY)
    return <LitanyBlock prayerBlock={prayerBlock} {...propsNoContent} />;

  if (blockTypeName === TWO_COLUMN)
    return <TwoColumnBlock prayerBlock={prayerBlock} {...propsNoContent} />;

  if (blockTypeName === SPACER)
    return <BlockSpacer height={text} {...propsNoContent} />;

  return <span />;
}
