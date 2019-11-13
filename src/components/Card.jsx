import styled from "styled-components";
import { style } from "../config";

const Card = styled.div`
  flex: 1;
  position: relative;
  background-color: ${style.blackLevelTwo};
  border: 1px #000 solid;
  border-radius: ${style.borderRadius};
  box-sizing: border-box;
  box-shadow: #000 0px 0px ${style.sizeXs};

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  &.active {
    box-shadow: ${style.primaryColor} 0px 0px ${style.sizeXs} 2px;
  }
`;

export default Card;
