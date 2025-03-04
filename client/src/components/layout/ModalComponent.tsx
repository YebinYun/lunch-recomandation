import React, { ReactNode } from "react";
import styled from "styled-components";
import TopLink from "./commons/TopLink.tsx";
import BottomLink from "./commons/BottomLink.tsx";

type props = {
  children: ReactNode;
  modalClickHandler: () => void;
  colorChange: string;
};

const ModalComponent = ({
  children,
  modalClickHandler,
  colorChange,
}: props) => {
  return (
    <ModalBackground>
      <ModalLayout>
        <TopLink
          modalClickHandler={modalClickHandler}
          colorChange={colorChange}
        />
        <MainWrap>{children}</MainWrap>
        <BottomLink colorChange={colorChange} />
      </ModalLayout>
    </ModalBackground>
  );
};
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;
const ModalLayout = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid black;
  border-radius: 15px;
  height: 70vh;
  width: 70vw;
  display: flex;
  flex-direction: column;
  z-index: 999;
`;
const MainWrap = styled.div`
  height: 80vh;
  background: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export default ModalComponent;
