import styled from "styled-components";

export const Scrollable = styled.div<{
  width: string;
  height: string;
  scrollY?: boolean;
  scrollX?: boolean;
}>`
  width: ${(props) => props.width};
  overflow-y: ${(props) => (props.scrollY ? "scroll" : "hidden")};
  overflow-x: ${(props) => (props.scrollX ? "scroll" : "hidden")};
  height: ${(props) => props.height};
`;
