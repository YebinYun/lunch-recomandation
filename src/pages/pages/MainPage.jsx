import React, { useState } from "react";
import styled from "styled-components";
import HomepageContainer from "../layout/HomepageContainer";
import Slots from "../../components/Slots";
import ResultModal from "../../components/modal/ResultModal";
import { deselectedOptions } from "../../utils/dummy/deselectedOptions";
import { PUBLIC_FOOD_IMAGE } from "../../assets/images/images";

const MainTitle = styled.div`
  width: 70vw;
  background: linear-gradient(
      177deg,
      rgba(255, 39, 0, 0.38) 0%,
      rgba(234, 133, 115, 0) 100%
    ),
    #fff2e9;
  margin: 1rem 0;
  padding: 1rem 0;
  border: 3px solid black;
  border-radius: 15px;
  & h1 {
    padding-bottom: 1rem;
    color: white;
    text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
      1px 1px 0 black;
  }
  & h3 {
    color: white;
    text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
      1px 1px 0 black;
    font-weight: 100;
  }
`;

const MainPage = () => {
  const [food1, setFood1] = useState(PUBLIC_FOOD_IMAGE.koreanFood1);
  const [food2, setFood2] = useState(PUBLIC_FOOD_IMAGE.koreanFood2);
  const [food3, setFood3] = useState(PUBLIC_FOOD_IMAGE.koreanFood3);

  // 슬롯이 다 돌아갔는지를 알려주는 useState
  const [result, setResult] = useState(false);

  // 클릭시 결과 모달 구현
  const [visibleModal, setVisibleModal] = useState(false);

  // 클릭시 result값을 false로 바꿔줌
  const buttonClickHandler = () => {
    setResult(!result);
    // 클릭시 변경 값이 보여야 하므로 true.
    setVisibleModal(!visibleModal);
    console.log("Result:", result);
  };
  const handleSlotFinish = () => {
    // 슬롯이 다 돌아갔을때, result 상태를 true로 바꾸는 함수
    setResult(true);
  };

  // 자동완성 구현
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  return (
    <HomepageContainer>
      <MainTitle>
        <h1> 오늘 뭐 먹지? </h1>
        <h3> 메뉴 추천 룰렛 </h3>
      </MainTitle>

      {/* 게임 */}
      <Slots
        setFood1={setFood1}
        setFood2={setFood2}
        setFood3={setFood3}
        onClick={buttonClickHandler}
        onSlotFinish={handleSlotFinish}
        inputValue={inputValue}
        setInputValue={setInputValue}
        options={options}
        setOptions={setOptions}
        deselectedOptions={deselectedOptions}
      />

      {/* visibleModal 값이 true && result(룰렛이 다돌아간 상태를 저장) 이 true 일 때만 MainModal 컴포넌트를 표시 */}
      {visibleModal && result && (
        <ResultModal
          inputValue={inputValue}
          food1={food1}
          result={result}
          buttonClickHandler={buttonClickHandler}
        />
      )}
    </HomepageContainer>
  );
};

export default MainPage;
