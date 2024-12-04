import { MDXEditor } from "@mdxeditor/editor";
import styled from "styled-components";

// index.tsx

export const StyledPrayerBlockEditor = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  align-content: start;
  height: calc(100vh - 50px);
  overflow-y: scroll;
  padding-right: 12px;
`;

export const BlocksWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  align-content: start;
  padding: 0 36px;
`;

// BlockForm.tsx

export const StyledBlockForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 24px;
  gap: 4px;
  align-content: start;
  padding-top: 24px;
`;

export const BlockContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  align-content: start;

  i {
    font-size: 12px;
  }
`;

export const BlockContentValues = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  align-content: start;
  padding-left: 48px;
`;

export const MarkdownEditor = styled(MDXEditor)`
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export const BlockControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;

  button {
    background-color: transparent;
    border: 0;
    outline: 0;
  }
`;
