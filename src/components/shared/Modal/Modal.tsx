import styled from "styled-components";

export const ModalActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 16px;
`;

export const ModalButton = styled.button<{ $color: string }>`
  position: relative;
  background-color: ${({ $color }) => $color};
  border-radius: 6px;
  color: white;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border-radius: 6px;
  }

  &:hover::before {
    opacity: 1;
  }
`;