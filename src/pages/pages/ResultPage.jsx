import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ResultModal from "../../components/modal/ResultModal";
import BlogModal from "../../components/modal/BlogModal";
import { useLocation } from "react-router-dom"; // useNavigate로 전달한 쿼리파라미터값(uri)을 사용하기 위한 훅
import HomepageContainer from "../layout/HomepageContainer";
import RenderSlider from "../../components/recomandation/RenderSlider";

// 추천식당 창
const RecomandationWrap = styled.div`
  position: relative;
  width: 37vw;
  height: 75vh;
  background-color: #ffe9da;
  border: 3px solid #000;
  border-radius: 25px 25px 0 0;
  margin: 0 1rem;
`;

// 추천 음식
const TopWrap = styled.div`
  border-bottom: 3px solid #000;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  > h1 {
    font-size: 2rem;
  }
`;

// 추천 정보
const InformationWrap = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  > h1 {
    font-size: 1.8rem;
    padding-bottom: 10px;
  }
  > p {
    font-size: 1.2rem;
  }
  > div {
    font-size: 1.2rem;
  }
  .InformationText {
    height: 25px;
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    margin: 10px;
    > a {
      width: 430px;
      padding-left: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      &:link {
        color: black;
      }
      &:hover {
        font-weight: bold;
      }
      &:visited {
        color: black;
      }
    }
    > span {
      color: #777;
      margin-left: 1rem;
    }
    > h4 {
      white-space: nowrap;
      font-weight: normal;
    }
  }
  .address1 {
    line-height: 1.8rem;
  }
  .address2 {
    width: 430px;
    height: 25px;
    line-height: 1.8rem;
    margin-left: 1rem;
  }
`;

// 상세 보기
const ViewDetails = styled.div`
  border-radius: 10px;
  border: 3px solid #000;
  height: 60px;
  width: 500px;
  background: #f2c198;
  position: absolute;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 47px 20px 47px;
  cursor: pointer;
  &:hover {
    background: #ffc391;
  }
`;

const ResultPage = () => {
  // axios로 받은 검색 데이터를 저장해두는 상태
  const [data, setData] = useState([]);
  const [images, setImages] = useState([[], []]);

  // useNavigate로 전달한 쿼리파라미터의 값(uri)의 값을 활용하기 위한 변수선언
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const food = searchParams.get("food");
  const inputValue = searchParams.get("inputValue");

  // 검색결과 5개중 랜덤으로 2개를 뽑기 위한 함수
  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/v1/search/local.json", {
          params: {
            query: `서울 ${inputValue} ${food} `,
            display: 5,
          },
          headers: {
            "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
          },
        });
        const randomItems = getRandomItems(response.data.items, 2);

        // 받아온 데이터의 일부 title가 <b>,</b>를 포함하기에, 해당 값을 제거하기 위한 코드
        console.log(response);
        const modifiedItems = randomItems.map((item) => {
          let str = item.title;
          str = str.replace(/<\/?b>/g, "");
          return { ...item, title: str };
        });
        setData(modifiedItems);
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        console.log(message);
      }
    };

    fetchData();
  }, []);

  // 이미지를 받아오는 API의 쿼리에 검색 API결과가 필요하기 때문에,
  // 검색 API가 실행된 후 실행하기 위해 data(검색api 결과)가 변동이 있을때 이미지 API실행
  useEffect(() => {
    // Fetch images for each index
    const fetchImageData = async (index) => {
      try {
        const response = await axios.get("/v1/search/image", {
          params: {
            query: `${data[index].title}${food}`,
            display: 100,
          },
          headers: {
            "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
          },
        });
        console.log(response);

        // Update the state for the appropriate index
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = response.data.items;
          return newImages;
        });
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        console.log(message);
      }
    };

    // Fetch images for both indices
    fetchImageData(0);
    fetchImageData(1);
  }, [data]);

  // 음식점 블로그 api받아오는 코드
  const [blogData, setBlogData] = useState([]);
  useEffect(() => {
    const fetchData = async (index) => {
      try {
        const response = await axios.get("/v1/search/blog.json", {
          params: {
            query: `${data[index].title} 내돈내산`,
            display: 4,
          },
          headers: {
            "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
          },
        });

        // title <br>,</br> 문자열 필터링 로직 추가
        const responseData = response.data.items.map((item) => {
          let str = item.title;
          str = str.replace(/<\/?b>/g, "");
          return { ...item, title: str };
        });

        setBlogData((prevData) => {
          const newData = [...prevData];
          newData[index] = responseData;
          return newData;
        });

        console.log(response);
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        console.log(message);
      }
    };

    fetchData(0);
    fetchData(1);
  }, [data]);

  // 지역구 모달창
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(!showModal);
  };

  // 상세보기 음식점1 모달창
  const [showReview, setShowReview] = useState(false);
  // 상세보기 음식점2 모달창
  const [showReview2, setShowReview2] = useState(false);

  const [selectedModalIndex, setSelectedModalIndex] = useState(null);

  const openReview = (index) => {
    if (index === 0) {
      setShowReview(true);
    } else if (index === 1) {
      setShowReview2(true);
    }
    setSelectedModalIndex(index);
  };

  const closeReview = () => {
    setShowReview(false);
    setShowReview2(false);
  };

  return (
    <>
      {/* 데이터 불러오기전 분기*/}
      {data.length > 0 && images.length > 0 ? (
        <HomepageContainer>
          {/* 모달창 띄우는 곳*/}
          {showModal && <ResultModal openModal={openModal} />}

          {/* 메인창 */}
          <div style={{ display: "flex" }}>
            {/* 추천 창 1 */}
            {data.map((recommendation, index) => (
              <RecomandationWrap key={index}>
                <TopWrap>
                  <h1>
                    (추천 {index + 1}) {recommendation.category}
                  </h1>
                </TopWrap>
                <RenderSlider index={index} images={images} />

                <InformationWrap>
                  <h1 className="InformationText"> {recommendation.title} </h1>
                  <p className="InformationText">
                    <h4>사이트 :</h4>
                    {recommendation.link ? (
                      <a
                        target="_blank"
                        href={recommendation.link}
                        rel="noreferrer">
                        {recommendation.link}
                      </a>
                    ) : (
                      <span>
                        {recommendation.title}은 사이트를 제공하고 있지
                        않습니다.
                      </span>
                    )}
                  </p>
                  <div className="InformationText">
                    <div className="address1">주소 :</div>{" "}
                    <div className="address2">{recommendation.roadAddress}</div>
                  </div>
                </InformationWrap>

                <ViewDetails
                  onClick={() => {
                    openReview(index);
                  }}>
                  <h1> 상세보기 </h1>
                </ViewDetails>

                {/* 상세보기 띄우는 곳*/}
                {showReview || showReview2 ? (
                  <BlogModal
                    openReview={openReview}
                    closeReview={closeReview}
                    blogData={blogData}
                    data={data}
                    selectedModalIndex={selectedModalIndex}
                  />
                ) : (
                  ""
                )}
              </RecomandationWrap>
            ))}
          </div>
          {/* 메인창 끝 */}
        </HomepageContainer>
      ) : (
        <div>데이터를 불러오는 중입니다..</div>
      )}
    </>
  );
};

export default ResultPage;
