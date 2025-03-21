import { BlockTypes, PrayerBlock } from "../../database";
import markdownit from "markdown-it";
import LitanyBlock from "./LitanyBlock";
import {
  BlockImage,
  BlockImageSmall,
  BlockSpacer,
  Body,
  BodyCentered,
  CenteredTitle,
  InfoText,
  Quote,
  Reference,
} from "./StyledComponents";

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
  SPACER,
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

  const props = {
    key: prayerBlock.id,
    dangerouslySetInnerHTML: { __html: md.render(text) },
    className: prayerBlock.spaceAbove ? "space-above" : "",
  };

  if (blockTypeName === BODY) return <Body {...props} />;
  if (blockTypeName === BODY_CENTERED) return <BodyCentered {...props} />;
  if (blockTypeName === CENTERED_TITLE) return <CenteredTitle {...props} />;
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
    return <BlockImage src={imageUrl} alt="" key={prayerBlock.id} />;

  if (blockTypeName === SMALL_IMAGE)
    return <BlockImageSmall src={imageUrl} alt="" key={prayerBlock.id} />;

  if (blockTypeName === LITANY)
    return <LitanyBlock prayerBlock={prayerBlock} />;

  if (blockTypeName === SPACER) return <BlockSpacer height={text} />;

  return <span />;
}
