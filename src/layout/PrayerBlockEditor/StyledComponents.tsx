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
