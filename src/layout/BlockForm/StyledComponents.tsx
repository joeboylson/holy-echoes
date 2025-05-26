import { MDXEditor } from "@mdxeditor/editor";
import styled from "styled-components";
import { BlockTypes } from "../../database";

export const StyledBlockForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 24px;
  gap: 4px;
  align-content: start;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
`;

export const BlockContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: start;

  i {
    font-size: 12px;
  }
`;

export const SpaceAboveWrapper = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 4px;
  height: 32px;
  align-items: center;
`;

export const BlockContentValues = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  align-content: start;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 12px;
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
